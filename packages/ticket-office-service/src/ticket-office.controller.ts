import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe.js';
import { type ReserveRequest, ReserveRequestSchema } from './types.js';
import { TicketOffice } from './ticket-office.js';

@Controller()
export class TicketOfficeController {
  @Post('/reserve')
  @UsePipes(new ZodValidationPipe(ReserveRequestSchema))
  reserve(@Body() request: ReserveRequest) {
    const ticketOffice = new TicketOffice();
    const reservation = ticketOffice.makeReservation(request);
    return reservation;
  }
}
