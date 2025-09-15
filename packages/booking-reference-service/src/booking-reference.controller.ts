import { Controller, Get } from '@nestjs/common';

let count = 123456789;

@Controller()
export class BookingReferenceController {
  @Get('booking_reference')
  getBookingReference(): string {
    count++;

    return count.toString(16);
  }
}
