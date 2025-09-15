import { BadRequestException, Body, Controller, Get, Inject, Param, Post, UsePipes } from '@nestjs/common';

import { type ReserveRequest, ReserveRequestSchema, Train, type Trains } from './models.js';
import { TRAIN_DATA_TOKEN } from './train-data.constants.js';
import { ZodValidationPipe } from './zod-validation.pipe.js';

@Controller()
export class TrainDataController {
  constructor(@Inject(TRAIN_DATA_TOKEN) private readonly trains: Trains) {}

  @Get('/data_for_train/:trainId')
  getTrain(@Param('trainId') trainId: string): Train | null {
    return this.trains[trainId] ?? null;
  }

  @Post('/reserve')
  @UsePipes(new ZodValidationPipe(ReserveRequestSchema))
  reserve(@Body() request: ReserveRequest) {
    const train = this.trains[request.train_id];

    // Validate request
    for (const seat of request.seats) {
      if (!(seat in (train?.seats ?? {}))) throw new BadRequestException(`seat not found ${seat}`);

      const existingReservation = train?.seats?.[seat]?.booking_reference;

      if (!!existingReservation?.trim() && existingReservation !== request.booking_reference)
        throw new BadRequestException(`already booked with reference: ${existingReservation}`);
    }

    train?.makeReservation(request.seats, request.booking_reference);
    return train;
  }

  @Post('/reset/:trainId')
  resetTrain(@Param('trainId') trainId: string): Train | null {
    const train = this.trains[trainId];
    train?.reset();

    return train ?? null;
  }
}
