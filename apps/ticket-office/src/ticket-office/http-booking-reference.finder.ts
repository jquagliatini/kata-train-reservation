import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-undici';
import { firstValueFrom } from 'rxjs';

import { TicketOfficeConfig } from '../config/ticket-office-config.type.js';

import { BookingReferenceFinder } from './booking-reference.finder.js';
import { BookingReference } from './booking-reference.js';

@Injectable()
export class HttpBookingReferenceFinder implements BookingReferenceFinder {
  private readonly bookingReferenceBaseUrl: string;
  constructor(
    private readonly http: HttpService,
    config: TicketOfficeConfig,
  ) {
    this.bookingReferenceBaseUrl = config.outbound.bookingReference;
  }

  async find(): Promise<BookingReference> {
    const { body } = await firstValueFrom(
      this.http.request(new URL(`${this.bookingReferenceBaseUrl}/booking_reference`), {
        method: 'GET',
        bodyTimeout: 200,
        idempotent: false,
      }),
    );

    return new BookingReference(await body.text());
  }
}
