import { Injectable } from '@nestjs/common';

import { BookingReferenceFinder } from '../src/ticket-office/booking-reference.finder.js';
import { BookingReference } from '../src/ticket-office/booking-reference.js';
import { TrainDataService } from '../src/ticket-office/http-train-data.service.js';

@Injectable()
export class FakeBookingReferenceFinder implements BookingReferenceFinder {
  private ref = 123456789;

  async find(): Promise<BookingReference> {
    return new BookingReference((this.ref++).toString(16));
  }
}

@Injectable()
export class FakeTrainDataService implements TrainDataService {
  async getTrain(): Promise<{
    seats: Record<string, { coach: string; seat_number: string; booking_reference: string }>;
  } | null> {
    return {
      seats: {
        '1A': { coach: 'A', seat_number: '1', booking_reference: '' },
        '2A': { coach: 'A', seat_number: '2', booking_reference: '' },
        '3A': { coach: 'A', seat_number: '3', booking_reference: '' },
        '4A': { coach: 'A', seat_number: '4', booking_reference: '' },
        '1B': { coach: 'B', seat_number: '1', booking_reference: '' },
        '2B': { coach: 'B', seat_number: '2', booking_reference: '' },
        '3B': { coach: 'B', seat_number: '3', booking_reference: '' },
        '4B': { coach: 'B', seat_number: '4', booking_reference: '' },
      },
    };
  }
}
