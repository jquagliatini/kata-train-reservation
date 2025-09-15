import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-undici';
import { firstValueFrom } from 'rxjs';
import { getGlobalDispatcher, interceptors } from 'undici';

import { BookingReferenceFinder } from './booking-reference.finder.js';
import { BookingReference } from './booking-reference.js';
import { TicketOfficeConfig } from './ticket-office-config.type.js';

@Injectable()
export class HttpBookingReferenceFinder implements BookingReferenceFinder {
  private readonly bookingReferenceBaseUrl: string;
  constructor(
    private readonly http: HttpService,
    config: TicketOfficeConfig,
  ) {
    this.bookingReferenceBaseUrl = config.outbound.bookingReference;
  }

  // TODO: remove keep-alive for localhost
  async find(): Promise<BookingReference> {
    const { body } = await firstValueFrom(
      this.http.request(new URL(`${this.bookingReferenceBaseUrl}/booking_reference`), {
        method: 'GET',
        bodyTimeout: 200,
        idempotent: false,

        dispatcher: getGlobalDispatcher().compose(interceptors.retry()),
      }),
    );

    return new BookingReference(await body.text());
  }
}
