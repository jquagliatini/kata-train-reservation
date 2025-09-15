import { Module } from '@nestjs/common';
import { BookingReferenceController } from './booking-reference.controller.js';

@Module({ controllers: [BookingReferenceController] })
export class BookingReferenceModule {}
