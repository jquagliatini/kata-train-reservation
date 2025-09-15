import { HttpStatus } from '@nestjs/common';

import { describe, it } from './fixtures.js';

describe('TicketOffice', () => {
  it('should return a bad request', async ({ http }) => {
    await http.reserve({ hello: 'world' } as any).expect(HttpStatus.BAD_REQUEST);
  });

  it('should use a booking reference from the BookingReference service', async ({ expect, http }) => {
    const reservation = await http.reserve({ seat_count: 1, train_id: 'express_2000' }).expect(HttpStatus.OK);

    expect(reservation.body.bookingId).toEqual('75bcd15');
  });
});
