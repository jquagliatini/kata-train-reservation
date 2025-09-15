import { type Server } from 'node:http';

import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent, type Response as SResponse, type Test as SuperTest } from 'supertest';
import { it as base } from 'vitest';

import { type ReserveRequest } from '../src/types.js';
import { Reservation } from '../src/ticket-office/ticket-office.js';
import { TicketOfficeModule } from '../src/ticket-office/ticket-office.module.js';
import { BOOKING_REFERENCE_FINDER_TOKEN } from '../src/ticket-office/booking-reference.finder.js';

import { FakeBookingReferenceFinder } from './fakes.js';

type HttpResponse<T> = Omit<SResponse, 'body'> & { body: T };
type HttpTest<T> = Omit<SuperTest, 'then' | 'expect'> & {
  expect(statusCode: number): HttpTest<T>;
  then(onFulfilled: (value: HttpResponse<T>) => unknown): Promise<HttpResponse<T>>;
};

export class Fixtures {
  constructor(private readonly http: ReturnType<typeof agent>) {}

  reserve(request: ReserveRequest): HttpTest<Reservation> {
    return this.http.post('/reserve').send(request) as any;
  }
}

export { afterAll, afterEach, beforeAll, beforeEach, describe } from 'vitest';
export const it = base.extend<{ http: Fixtures }>({
  http: async ({}, use) => {
    const testingModule = await Test.createTestingModule({ imports: [TicketOfficeModule] })
      .overrideProvider(BOOKING_REFERENCE_FINDER_TOKEN)
      .useClass(FakeBookingReferenceFinder)
      .compile();

    const app = await testingModule.createNestApplication<INestApplication<Server>>().init();
    const server = app.getHttpServer();

    await use(new Fixtures(agent(server)));

    server.close();
  },
});

export const test = it;
