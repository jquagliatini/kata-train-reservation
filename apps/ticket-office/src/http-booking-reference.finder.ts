import { request, interceptors, getGlobalDispatcher } from 'undici';
import { Injectable } from '@nestjs/common';

import { BookingReferenceFinder } from './booking-reference.finder.js';
import { BookingReference } from './booking-reference.js';

@Injectable()
export class HttpBookingReferenceFinder implements BookingReferenceFinder {
  private static readonly BOOKING_REFERENCE_URL = new URL('http://localhost:3001/booking_reference');
  async find(): Promise<BookingReference> {
    // TODO: move inside a global HttpModule for injection?
    const { body } = await request(HttpBookingReferenceFinder.BOOKING_REFERENCE_URL, {
      method: 'GET',
      bodyTimeout: 200,
      idempotent: false,

      dispatcher: getGlobalDispatcher().compose(interceptors.retry()),
    });

    return new BookingReference(await body.text());
  }
}
