import z from 'zod';

export type Trains = Record<string, Train>;

export class Seat {
  constructor(readonly coach: string, readonly seat_number: string, public booking_reference: string) {}
}

export class Train {
  constructor(readonly seats: Record<string, Seat>) {}

  reset(): void {
    for (const seatId of Object.keys(this.seats)) {
      const seat = this.seats[seatId];
      if (seat) seat.booking_reference = '';
    }
  }

  makeReservation(seatIds: string[], bookingReference: string): void {
    for (const seatId of seatIds) {
      const seat = this.seats[seatId];
      if (seat) seat.booking_reference = bookingReference;
    }
  }
}

export const ReserveRequestSchema = z.object({
  train_id: z.string(),
  seats: z.array(z.string()),
  booking_reference: z.string(),
});
export type ReserveRequest = z.infer<typeof ReserveRequestSchema>;
