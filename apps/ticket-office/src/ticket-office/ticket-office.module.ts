import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-undici';
import { getGlobalDispatcher, interceptors } from 'undici';

import { TicketOfficeConfigModule } from '../config/ticket-office-config.module.js';

import { TicketOfficeController } from './ticket-office.controller.js';
import { BOOKING_REFERENCE_FINDER_TOKEN } from './booking-reference.finder.js';
import { ReservationService } from './reservation.service.js';
import { HttpBookingReferenceFinder } from './http-booking-reference.finder.js';
import { ReservableTrainRepository } from './reservable-train-repository.js';
import { HttpTrainDataService, TRAIN_DATA_SERVICE_TOKEN } from './train-data.service.js';

@Module({
  imports: [
    TicketOfficeConfigModule.registerAsync(),
    HttpModule.register({
      dispatcher: getGlobalDispatcher().compose(interceptors.retry()),
    }),
  ],
  controllers: [TicketOfficeController],
  providers: [
    ReservationService,
    ReservableTrainRepository,
    { provide: TRAIN_DATA_SERVICE_TOKEN, useClass: HttpTrainDataService },
    { provide: BOOKING_REFERENCE_FINDER_TOKEN, useClass: HttpBookingReferenceFinder },
  ],
})
export class TicketOfficeModule {}
