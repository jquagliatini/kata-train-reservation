import assert from 'node:assert';

import { BadRequestException } from '@nestjs/common';

import { Message, MessageSource } from '../kernel/message-source.js';
import { Branded } from '../types.js';

import { BookingReference } from './booking-reference.js';

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

type Seat = { number: SeatNumber; isBooked: boolean };
export class Coach {
  constructor(
    readonly id: CoachId,
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

  bookSeats(count: SeatCount): [bookedSeatNumbers: SeatNumber[], updatedCoach: Coach] {
    let remainingCount = count.toNumber();
    const bookedSeatNumbers: SeatNumber[] = [];
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

export class TrainId extends Branded<'TrainId'> {
  constructor(private readonly id: string) {
    super();
  }

  override toString(): string {
    return this.id;
  }

  static from(id: string): TrainId {
    const trimmed = id.trim();
    assert.ok(!!trimmed, 'no empty id');

    return new TrainId(trimmed);
  }
}

export class CoachId extends Branded<'CoachId'> {
  private constructor(private readonly value: string) {
    super();
  }

  override toString(): string {
    return this.value;
  }

  static from(value: string) {
    const trimmed = value.trim();
    assert.ok(!!trimmed, 'no empty id');

    return new CoachId(trimmed);
  }
}

export class SeatNumber extends Branded<'SeatNumber'> {
  private constructor(private readonly seatNumber: number) {
    super();
  }

  toNumber(): number {
    return this.seatNumber;
  }

  static from(value: number) {
    assert.ok(
      Number.isFinite(value) && Number.isInteger(value) && value > 0,
      'the seat number should be a positive integer',
    );

    return new SeatNumber(value);
  }
}

export class SeatBooked extends Message<'SeatBooked'> {
  readonly trainId: string;
  readonly seats: { coach: string; seatNumber: number }[];
  readonly bookingReference: string;

  constructor(props: {
    bookingReference: BookingReference;
    trainId: TrainId;
    seats: { coach: CoachId; seatNumber: SeatNumber }[];
  }) {
    super();

    this.trainId = props.trainId.toString();
    this.bookingReference = props.bookingReference.toString();
    this.seats = props.seats.map(({ coach, seatNumber }) => ({
      coach: coach.toString(),
      seatNumber: seatNumber.toNumber(),
    }));
  }
}

export class ReservableTrain extends MessageSource<SeatBooked> {
  private static readonly MAX_OCCUPATION_RATE = 0.7;

  constructor(
    private readonly id: TrainId,
    private coaches: Coach[],
  ) {
    super();
  }

  private get seatCount(): number {
    return this.coaches.reduce((sum, coach) => sum + coach.seats.length, 0);
  }

  private get bookedSeatsCount(): number {
    return this.coaches.reduce((sum, coach) => sum + coach.bookedSeatCount, 0);
  }

  canBook(seatCount: SeatCount): boolean {
    return this.bookedSeatsCount + seatCount.toNumber() / this.seatCount <= ReservableTrain.MAX_OCCUPATION_RATE;
  }

  book(bookingReference: BookingReference, count: SeatCount): { coach: string; seatNumber: number }[] {
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

    this.pushMessage(
      new SeatBooked({
        bookingReference,
        trainId: this.id,
        seats: bookedSeatNumbers.map((seatNumber) => ({
          seatNumber,
          coach: coach.id,
        })),
      }),
    );

    return bookedSeatNumbers.map((seatNumber) => ({ coach: coach.id.toString(), seatNumber: seatNumber.toNumber() }));
  }
}
