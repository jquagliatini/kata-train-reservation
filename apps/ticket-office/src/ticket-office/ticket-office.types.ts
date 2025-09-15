export class ReservationRequest {
  constructor(
    public trainId: string,
    public seatCount: number,
  ) {}
}

type Seat = {
  coach: string;
  seatNumber: number;
};

export type Reservation = {
  trainId: string;
  bookingId: string;
  seats: Seat[];
};
