import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { MessageSourceRepository } from '../kernel/message-source-repository.js';

import { TRAIN_DATA_SERVICE_TOKEN, type TrainDataService } from './train-data.service.js';
import { Coach, CoachId, ReservableTrain, SeatBooked, SeatNumber, TrainId } from './reservable-train.js';

@Injectable()
export class ReservableTrainRepository extends MessageSourceRepository<ReservableTrain> {
  constructor(@Inject(TRAIN_DATA_SERVICE_TOKEN) private readonly trains: TrainDataService) {
    super();
  }

  async find(id: string): Promise<ReservableTrain> {
    const train = await this.trains.getTrain(id);
    if (train == null) throw new NotFoundException(id);

    const coaches = Object.values(train.seats)
      .reduce((coaches, seat) => {
        const isBooked = !!seat.booking_reference.trim();
        const coachSeat = { number: SeatNumber.from(seat.seat_number), isBooked };

        const existingCoach = coaches.get(seat.coach);
        return coaches.set(
          seat.coach,
          existingCoach?.addSeat(coachSeat) ?? new Coach(CoachId.from(seat.coach), [coachSeat]),
        );
      }, new Map<string, Coach>())
      .values()
      .toArray();

    return new ReservableTrain(TrainId.from(id), coaches);
  }

  override async persist(train: ReservableTrain): Promise<void> {
    await Promise.all(this.with((match) => match.when(SeatBooked, this.persistSeatBooked)).persist(train));
  }

  private async persistSeatBooked({ bookingReference, seats, trainId }: SeatBooked) {
    await this.trains.book({
      train_id: trainId,
      booking_reference: bookingReference,
      seats: seats.map(({ coach, seatNumber }) => `${seatNumber}${coach}`),
    });
  }
}
