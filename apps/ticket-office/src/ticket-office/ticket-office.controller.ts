import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from '../zod-validation.pipe.js';
import { type ReserveRequest, ReserveRequestSchema } from '../types.js';

import { type ReservationDto } from './ticket-office.types.js';
import { TicketOffice } from './ticket-office.js';

@Controller()
export class TicketOfficeController {
  constructor(private readonly reservations: TicketOffice) {}

  @Post('/reserve')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(ReserveRequestSchema))
  async reserve(@Body() request: ReserveRequest): Promise<ReservationDto> {
    const reservation = await this.reservations.makeReservation({
      trainId: request.train_id,
      seatCount: request.seat_count,
    });

    return {
      train_id: reservation.trainId,
      booking_reference: reservation.bookingId,
      seats: reservation.seats.map(({ coach, seatNumber }) => `${seatNumber}${coach}`),
    };
  }
}
