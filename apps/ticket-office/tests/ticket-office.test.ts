import { HttpStatus } from '@nestjs/common';

import { describe, it } from './fixtures.js';

describe('TicketOffice', () => {
  it('should return a bad request', async ({ http }) => {
    await http.reserve({ hello: 'world' } as any).expect(HttpStatus.BAD_REQUEST);
  });

  it.fails('...', ({ expect }) => {
    expect.assertions(1);
  });
});
