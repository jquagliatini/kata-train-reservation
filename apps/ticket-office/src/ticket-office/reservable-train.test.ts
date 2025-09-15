import { describe, it } from '../../tests/fixtures.js';

import { BookingReference } from './booking-reference.js';
import { Coach, CoachId, ReservableTrain, SeatCount, SeatNumber, TrainId } from './reservable-train.js';

describe('Domain', () => {
  describe('SeatCount', () => {
    it('should wrap an integer', ({ expect }) => {
      expect(SeatCount.from(1).toNumber()).toBe(1);
    });

    it('should wrap 0', ({ expect }) => {
      expect(SeatCount.from(0).toNumber()).toBe(0);
    });

    it('should throw when wrapping a float', ({ expect }) => {
      expect(() => SeatCount.from(1.1)).toThrow(`seat count should be an integer`);
    });

    it('should throw when wrapping a negative value', ({ expect }) => {
      expect(() => SeatCount.from(-1)).toThrow(`seat count should be positive or null`);
    });
  });

  describe('Coach', () => {
    it('should book the number of seats requested', ({ expect }) => {
      const coach = new Coach(CoachId.from('A'), [
        { number: SeatNumber.from(1), isBooked: false },
        { number: SeatNumber.from(2), isBooked: false },
        { number: SeatNumber.from(3), isBooked: false },
        { number: SeatNumber.from(4), isBooked: false },
      ]);

      const [bookedSeatNumber, bookedCoach] = coach.bookSeats(SeatCount.from(2));
      expect(bookedSeatNumber).toStrictEqual([SeatNumber.from(1), SeatNumber.from(2)]);
      expect(bookedCoach).toStrictEqual(
        new Coach(CoachId.from('A'), [
          { number: SeatNumber.from(1), isBooked: true },
          { number: SeatNumber.from(2), isBooked: true },
          { number: SeatNumber.from(3), isBooked: false },
          { number: SeatNumber.from(4), isBooked: false },
        ]),
      );
    });

    it('should indicate which occupation rate is available to booking', ({ expect }) => {
      const coach = new Coach(CoachId.from('A'), [
        { number: SeatNumber.from(1), isBooked: true },
        { number: SeatNumber.from(2), isBooked: true },
        { number: SeatNumber.from(3), isBooked: true },
        { number: SeatNumber.from(4), isBooked: true },
        { number: SeatNumber.from(5), isBooked: true },
        { number: SeatNumber.from(6), isBooked: true },
        { number: SeatNumber.from(7), isBooked: true },
        { number: SeatNumber.from(8), isBooked: false },
        { number: SeatNumber.from(9), isBooked: false },
        { number: SeatNumber.from(10), isBooked: false },
      ]);

      expect(coach.projectOccupationRate(SeatCount.from(1))).toEqual(0.8);
    });
  });

  describe('ReservableTrain', () => {
    it('should book the number of seat requested', ({ expect }) => {
      const train = new ReservableTrain(TrainId.from('express_2000'), [
        new Coach(CoachId.from('A'), [
          { number: SeatNumber.from(1), isBooked: false },
          { number: SeatNumber.from(2), isBooked: false },
          { number: SeatNumber.from(3), isBooked: false },
          { number: SeatNumber.from(4), isBooked: false },
        ]),
        new Coach(CoachId.from('B'), [
          { number: SeatNumber.from(1), isBooked: false },
          { number: SeatNumber.from(2), isBooked: false },
          { number: SeatNumber.from(3), isBooked: false },
          { number: SeatNumber.from(4), isBooked: false },
        ]),
      ]);

      train.book(new BookingReference((123456789).toString(16)), SeatCount.from(3));

      expect(train).toStrictEqual(
        new ReservableTrain(TrainId.from('express_2000'), [
          new Coach(CoachId.from('A'), [
            { number: SeatNumber.from(1), isBooked: true },
            { number: SeatNumber.from(2), isBooked: true },
            { number: SeatNumber.from(3), isBooked: true },
            { number: SeatNumber.from(4), isBooked: false },
          ]),
          new Coach(CoachId.from('B'), [
            { number: SeatNumber.from(1), isBooked: false },
            { number: SeatNumber.from(2), isBooked: false },
            { number: SeatNumber.from(3), isBooked: false },
            { number: SeatNumber.from(4), isBooked: false },
          ]),
        ]),
      );
    });
  });
});
