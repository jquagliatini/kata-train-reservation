import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe.js';
import { type ReserveRequest, ReserveRequestSchema } from './types.js';
import { type Reservation, ReservationRequest, TicketOffice } from './ticket-office.js';

@Controller()
export class TicketOfficeController {
  @Post('/reserve')
  @UsePipes(new ZodValidationPipe(ReserveRequestSchema))
  reserve(@Body() request: ReserveRequest): Reservation {
    const ticketOffice = new TicketOffice();
    const reservationRequest = new ReservationRequest(request.train_id, request.seat_count);
    const reservation = ticketOffice.makeReservation(reservationRequest);
    return reservation;
  }
}
