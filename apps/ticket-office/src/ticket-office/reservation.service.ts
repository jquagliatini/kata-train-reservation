import { Inject, Injectable } from '@nestjs/common';

import { BOOKING_REFERENCE_FINDER_TOKEN, type BookingReferenceFinder } from './booking-reference.finder.js';
import { type ReservableTrainRepository } from './reservable-train-repository.js';
import { SeatCount } from './reservable-train.js';
import { Reservation } from './ticket-office.js';

@Injectable()
export class ReservationService {
  constructor(
    @Inject(BOOKING_REFERENCE_FINDER_TOKEN)
    private readonly bookingReferenceFinder: BookingReferenceFinder,
    private readonly reservableTrainRepository: ReservableTrainRepository,
  ) {}

  async reserve(request: { trainId: string; seatCount: number }): Promise<Reservation> {
    const bookingReference = await this.bookingReferenceFinder.find();
    const train = await this.reservableTrainRepository.find(request.trainId);

    const seats = train.book(SeatCount.from(request.seatCount));

    await this.reservableTrainRepository.persist(train);

    return {
      trainId: request.trainId,
      seats: seats.map(({ coach, seatNumber }) => ({ coach, seatNumber: Number(seatNumber) })),
      bookingId: bookingReference.toString(),
    };
  }
}
