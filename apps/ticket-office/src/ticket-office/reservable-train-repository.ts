import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { TRAIN_DATA_SERVICE_TOKEN, type TrainDataService } from './http-train-data.service.js';
import { Coach, ReservableTrain } from './reservable-train.js';

@Injectable()
export class ReservableTrainRepository {
  constructor(@Inject(TRAIN_DATA_SERVICE_TOKEN) private readonly trains: TrainDataService) {}

  async find(id: string): Promise<ReservableTrain> {
    const train = await this.trains.getTrain(id);
    if (train == null) throw new NotFoundException(id);

    const coaches = Object.values(train.seats)
      .reduce((coaches, seat) => {
        const isBooked = !!seat.booking_reference.trim();
        const coachSeat = { number: seat.seat_number, isBooked };

        const existingCoach = coaches.get(seat.coach);
        return coaches.set(seat.coach, existingCoach?.addSeat(coachSeat) ?? new Coach(seat.coach, [coachSeat]));
      }, new Map<string, Coach>())
      .values()
      .toArray();

    return new ReservableTrain(coaches);
  }
}
