import { describe, it } from '../../tests/fixtures.js';

import { Coach, ReservableTrain, SeatCount } from './reservable-train.js';

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
      const coach = new Coach('A', [
        { number: '1', isBooked: false },
        { number: '2', isBooked: false },
        { number: '3', isBooked: false },
        { number: '4', isBooked: false },
      ]);

      const [bookedSeatNumber, bookedCoach] = coach.bookSeats(SeatCount.from(2));
      expect(bookedSeatNumber).toStrictEqual(['1', '2']);
      expect(bookedCoach).toStrictEqual(
        new Coach('A', [
          { number: '1', isBooked: true },
          { number: '2', isBooked: true },
          { number: '3', isBooked: false },
          { number: '4', isBooked: false },
        ]),
      );
    });

    it('should indicate which occupation rate is available to booking', ({ expect }) => {
      const coach = new Coach('A', [
        { number: '1', isBooked: true },
        { number: '2', isBooked: true },
        { number: '3', isBooked: true },
        { number: '4', isBooked: true },
        { number: '5', isBooked: true },
        { number: '6', isBooked: true },
        { number: '7', isBooked: true },
        { number: '8', isBooked: false },
        { number: '9', isBooked: false },
        { number: '10', isBooked: false },
      ]);

      expect(coach.projectOccupationRate(SeatCount.from(1))).toEqual(0.8);
    });
  });

  describe('ReservableTrain', () => {
    it('should book the number of seat requested', ({ expect }) => {
      const train = new ReservableTrain([
        new Coach('A', [
          { number: '1', isBooked: false },
          { number: '2', isBooked: false },
          { number: '3', isBooked: false },
          { number: '4', isBooked: false },
        ]),
        new Coach('B', [
          { number: '1', isBooked: false },
          { number: '2', isBooked: false },
          { number: '3', isBooked: false },
          { number: '4', isBooked: false },
        ]),
      ]);

      train.book(SeatCount.from(3));

      expect(train).toStrictEqual(
        new ReservableTrain([
          new Coach('A', [
            { number: '1', isBooked: true },
            { number: '2', isBooked: true },
            { number: '3', isBooked: true },
            { number: '4', isBooked: false },
          ]),
          new Coach('B', [
            { number: '1', isBooked: false },
            { number: '2', isBooked: false },
            { number: '3', isBooked: false },
            { number: '4', isBooked: false },
          ]),
        ]),
      );
    });
  });
});
