import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-undici';
import { firstValueFrom } from 'rxjs';
import { getGlobalDispatcher, interceptors } from 'undici';

import { BookingReferenceFinder } from './booking-reference.finder.js';
import { BookingReference } from './booking-reference.js';

@Injectable()
export class HttpBookingReferenceFinder implements BookingReferenceFinder {
  constructor(private readonly http: HttpService) {}

  // TODO:
  //  - move to configuration
  //  - remove keep-alive for localhost
  private static readonly BOOKING_REFERENCE_URL = new URL('http://localhost:3001/booking_reference');
  async find(): Promise<BookingReference> {
    const { body } = await firstValueFrom(
      this.http.request(HttpBookingReferenceFinder.BOOKING_REFERENCE_URL, {
        method: 'GET',
        bodyTimeout: 200,
        idempotent: false,

        dispatcher: getGlobalDispatcher().compose(interceptors.retry()),
      }),
    );

    return new BookingReference(await body.text());
  }
}
