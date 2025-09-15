import { NotFoundException } from '@nestjs/common';
import { mock } from 'vitest-mock-extended';

import { describe, it } from '../../tests/fixtures.js';

import { TrainDataService } from './train-data.service.js';
import { ReservableTrainRepository } from './reservable-train-repository.js';
import { Coach, CoachId, ReservableTrain, SeatCount, SeatNumber, TrainId } from './reservable-train.js';
import { BookingReference } from './booking-reference.js';

describe('ReservableTrainRepository', () => {
  it('should map a TrainDataTrain, into a ReservableTrain', async ({ expect }) => {
    const trainDataService = mock<TrainDataService>();
    trainDataService.getTrain.calledWith('express_2000').mockResolvedValue({
      seats: {
        '1A': { coach: 'A', seat_number: 1, booking_reference: '' },
        '2A': { coach: 'A', seat_number: 2, booking_reference: '' },
        '3A': { coach: 'A', seat_number: 3, booking_reference: '' },
        '4A': { coach: 'A', seat_number: 4, booking_reference: '' },
        '1B': { coach: 'B', seat_number: 1, booking_reference: '' },
        '2B': { coach: 'B', seat_number: 2, booking_reference: '' },
        '3B': { coach: 'B', seat_number: 3, booking_reference: '' },
        '4B': { coach: 'B', seat_number: 4, booking_reference: '' },
      },
    });

    const repository = new ReservableTrainRepository(trainDataService);
    const train = await repository.find('express_2000');

    expect(train).toStrictEqual(
      new ReservableTrain(TrainId.from('express_2000'), [
        new Coach(CoachId.from('A'), [
          { isBooked: false, number: SeatNumber.from(1) },
          { isBooked: false, number: SeatNumber.from(2) },
          { isBooked: false, number: SeatNumber.from(3) },
          { isBooked: false, number: SeatNumber.from(4) },
        ]),
        new Coach(CoachId.from('B'), [
          { isBooked: false, number: SeatNumber.from(1) },
          { isBooked: false, number: SeatNumber.from(2) },
          { isBooked: false, number: SeatNumber.from(3) },
          { isBooked: false, number: SeatNumber.from(4) },
        ]),
      ]),
    );
  });

  it('should throw, when train data service returns null', async ({ expect }) => {
    const trainDataService = mock<TrainDataService>();
    trainDataService.getTrain.calledWith('express_2000').mockResolvedValue(null);

    const repository = new ReservableTrainRepository(trainDataService);
    await expect(() => repository.find('express_2000')).rejects.toThrowError(NotFoundException);
  });

  it('should persist the reservation into the train data service', async ({ expect }) => {
    const trainDataService = mock<TrainDataService>();
    trainDataService.book.mockResolvedValue();
    const repository = new ReservableTrainRepository(trainDataService);
    const train = new ReservableTrain(TrainId.from('express_2000'), [
      new Coach(CoachId.from('A'), [
        { isBooked: false, number: SeatNumber.from(1) },
        { isBooked: false, number: SeatNumber.from(2) },
        { isBooked: false, number: SeatNumber.from(3) },
        { isBooked: false, number: SeatNumber.from(4) },
      ]),
    ]);

    train.book(new BookingReference('AZYUT'), SeatCount.from(1));
    await repository.persist(train);

    expect(trainDataService.book).toHaveBeenCalledWith({
      booking_reference: 'AZYUT',
      train_id: 'express_2000',
      seats: ['1A'],
    });
  });
});
