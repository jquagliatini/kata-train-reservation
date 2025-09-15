export type ReservationRequest = {
  trainId: string;
  seatCount: number;
};

type Seat = {
  coach: string;
  seatNumber: number;
};

export type Reservation = {
  trainId: string;
  bookingId: string;
  seats: Seat[];
};

export type ReservationDto = { train_id: string; booking_reference: string; seats: string[] };
