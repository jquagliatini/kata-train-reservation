import { Module } from '@nestjs/common';
import { TicketOfficeController } from './ticket-office.controller.js';

@Module({ controllers: [TicketOfficeController] })
export class TicketOfficeModule {}
