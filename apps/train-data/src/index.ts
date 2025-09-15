import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import assert from 'node:assert';
import * as fs from 'node:fs';
import { json } from 'node:stream/consumers';
import { z } from 'zod';
import { TrainDataModule } from './train-data.module.js';
import { Seat, Train, Trains } from './models.js';

const logger = new Logger('🚆 Train Data');

main().catch((err) => logger.fatal(err));
async function main() {
  const port = Number(process.env['PORT']);
  assert.ok(Number.isFinite(port), 'no PORT envvar available');

  const trains = await getTrains();
  const app = await NestFactory.create(TrainDataModule.withTrains(trains));
  await app.listen(port);

  logger.log(`0.0.0.0:${port}`);
}

async function getTrains(): Promise<Trains> {
  const rawTrains = await json(
    fs.createReadStream(new URL(import.meta.resolve('../trains.json')), { encoding: 'utf-8' })
  );
  const trainsSchema = z.record(
    z.string(),
    z.object({
      seats: z.record(
        z.string(),
        z.object({ coach: z.string(), seat_number: z.string(), booking_reference: z.string() })
      ),
    })
  );

  const trains = await trainsSchema.parseAsync(rawTrains);
  return Object.fromEntries(
    Object.entries(trains).map(([trainId, { seats }]) => [
      trainId,
      new Train(
        Object.fromEntries(
          Object.entries(seats).map(([seatId, { coach, seat_number, booking_reference }]) => [
            seatId,
            new Seat(coach, seat_number, booking_reference),
          ])
        )
      ),
    ])
  );
}
