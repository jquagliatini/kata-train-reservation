import { HttpStatus } from '@nestjs/common';

import { describe, it } from './fixtures.js';

describe('TicketOffice', () => {
  it('should return a bad request', async ({ http }) => {
    await http.reserve({ hello: 'world' } as any).expect(HttpStatus.BAD_REQUEST);
  });

  it('should book a seat', async ({ expect, http }) => {
    const reservation = await http.reserve({ seat_count: 1, train_id: 'express_2000' }).expect(HttpStatus.OK);

    expect(reservation.body).toEqual({
      trainId: 'express_2000',
      seats: [{ coach: 'A', seatNumber: 1 }],
      bookingId: '75bcd15',
    });
  });
});
