import { Inject, Injectable } from '@nestjs/common';

import { BOOKING_REFERENCE_FINDER_TOKEN, type BookingReferenceFinder } from './booking-reference.finder.js';
import { Reservation } from './ticket-office.js';

@Injectable()
export class ReservationService {
  constructor(
    @Inject(BOOKING_REFERENCE_FINDER_TOKEN)
    private readonly bookingReferenceFinder: BookingReferenceFinder,
  ) {}

  async reserve(request: { trainId: string; seatCount: number }): Promise<Reservation> {
    const bookingReference = await this.bookingReferenceFinder.find();
    return { trainId: request.trainId, seats: [], bookingId: bookingReference.toString() };
  }
}
