import { Injectable } from '@nestjs/common';

import { BookingReferenceFinder } from '../src/ticket-office/booking-reference.finder.js';
import { BookingReference } from '../src/ticket-office/booking-reference.js';

@Injectable()
export class FakeBookingReferenceFinder implements BookingReferenceFinder {
  private ref = 123456789;

  async find(): Promise<BookingReference> {
    return new BookingReference((this.ref++).toString(16));
  }
}
