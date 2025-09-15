import { NotImplementedException } from '@nestjs/common';
import { ReserveRequest } from './types.js';

export class TicketOffice {
  makeReservation(_request: ReserveRequest) {
    throw new NotImplementedException();
  }
}
