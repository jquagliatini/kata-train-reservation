import { HttpService } from 'nestjs-undici';
import { mock } from 'vitest-mock-extended';
import { of } from 'rxjs';
import { Dispatcher } from 'undici';

import { describe, it } from '../tests/fixtures.js';

import { HttpBookingReferenceFinder } from './http-booking-reference.finder.js';

describe('HttpBookingReferenceFinder', () => {
  it('should call the booking service', async ({ expect }) => {
    const http = mock<HttpService>();
    http.request.mockImplementation(() => of({ body: { text: async () => '21345780' } } as Dispatcher.ResponseData));

    await new HttpBookingReferenceFinder(http).find();

    expect(http.request).toHaveBeenCalledWith(
      new URL('http://localhost:3001/booking_reference'),
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
