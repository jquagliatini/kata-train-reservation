import assert from 'node:assert';

import { BadRequestException } from '@nestjs/common';

export class SeatCount {
  private constructor(readonly value: number) {}

  toNumber(): number {
    return this.value;
  }

  static from(count: number): SeatCount {
    assert.ok(Number.isInteger(count), `seat count should be an integer`);
    assert.ok(count >= 0, 'seat count should be positive or null');

    return new SeatCount(count);
  }
}

type Seat = { number: string; isBooked: boolean };
export class Coach {
  constructor(
    readonly id: string,
    readonly seats: readonly Seat[],
  ) {}

  get bookedSeatCount(): number {
    return this.seats.filter(({ isBooked }) => isBooked).length;
  }

  get hasNoBookedSeat(): boolean {
    return this.seats.every((seat) => !seat.isBooked);
  }

  addSeat(seat: Seat): Coach {
    return new Coach(this.id, this.seats.concat(seat));
  }

  projectOccupationRate(count: SeatCount): number {
    return (this.bookedSeatCount + count.toNumber()) / this.seats.length;
  }

  canBook(count: SeatCount): boolean {
    return this.bookedSeatCount + count.toNumber() <= this.seats.length;
  }

  bookSeats(count: SeatCount): [bookedSeatNumbers: string[], updatedCoach: Coach] {
    let remainingCount = count.toNumber();
    const bookedSeatNumbers: string[] = [];
    const newSeats: Seat[] = [];

    for (const seat of this.seats) {
      if (remainingCount > 0 && !seat.isBooked) {
        remainingCount--;
        bookedSeatNumbers.push(seat.number);
        newSeats.push({ ...seat, isBooked: true });
      } else {
        newSeats.push(seat);
      }
    }

    return [bookedSeatNumbers, new Coach(this.id, newSeats)];
  }
}

export class NoBookableCoachAvailable extends BadRequestException {}

export class ReservableTrain {
  private static readonly MAX_OCCUPATION_RATE = 0.7;

  constructor(private coaches: Coach[]) {}

  private get seatCount(): number {
    return this.coaches.reduce((sum, coach) => sum + coach.seats.length, 0);
  }

  private get bookedSeatsCount(): number {
    return this.coaches.reduce((sum, coach) => sum + coach.bookedSeatCount, 0);
  }

  canBook(seatCount: SeatCount): boolean {
    return this.bookedSeatsCount + seatCount.toNumber() / this.seatCount <= ReservableTrain.MAX_OCCUPATION_RATE;
  }

  book(count: SeatCount): { coach: string; seatNumber: string }[] {
    if (!this.canBook(count)) throw new NoBookableCoachAvailable();

    const coachWithLeastImpact = this.coaches
      .map((coach, i) => [coach, i, coach.projectOccupationRate(count)] as const)
      .filter(([coach]) => coach.canBook(count))
      .sort((a, b) => a[2] - b[2])
      .at(0);

    if (!coachWithLeastImpact) throw new NoBookableCoachAvailable();

    const [coach, i] = coachWithLeastImpact;
    const [bookedSeatNumbers, newCoach] = coach.bookSeats(count);

    this.coaches[i] = newCoach;

    return bookedSeatNumbers.map((seatNumber) => ({ coach: coach.id, seatNumber }));
  }
}
