import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-undici';

import { TicketOfficeController } from './ticket-office.controller.js';
import { BOOKING_REFERENCE_FINDER_TOKEN } from './booking-reference.finder.js';
import { HttpBookingReferenceFinder } from './http-booking-reference.finder.js';
import { ReservationService } from './reservation.service.js';

@Module({
  imports: [HttpModule.register({})],
  controllers: [TicketOfficeController],
  providers: [ReservationService, { provide: BOOKING_REFERENCE_FINDER_TOKEN, useClass: HttpBookingReferenceFinder }],
})
export class TicketOfficeModule {}
