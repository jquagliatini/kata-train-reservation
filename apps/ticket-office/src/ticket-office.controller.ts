import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from './zod-validation.pipe.js';
import { type ReserveRequest, ReserveRequestSchema } from './types.js';
import { type Reservation } from './ticket-office.js';
import { ReservationService } from './reservation.service.js';

@Controller()
export class TicketOfficeController {
  constructor(private readonly reservations: ReservationService) {}

  @Post('/reserve')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(ReserveRequestSchema))
  reserve(@Body() request: ReserveRequest): Promise<Reservation> {
    return this.reservations.reserve({
      trainId: request.train_id,
      seatCount: request.seat_count,
    });
  }
}
