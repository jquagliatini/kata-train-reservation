import { BookingReference } from './booking-reference.js';

export interface BookingReferenceFinder {
  find(): Promise<BookingReference>;
}

export const BOOKING_REFERENCE_FINDER_TOKEN = Symbol();
