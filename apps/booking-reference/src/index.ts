import assert from 'node:assert';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { BookingReferenceModule } from './booking-reference.module.js';

const logger = new Logger('📌 BookingReference');

main().catch((err) => logger.fatal(err));
async function main() {
  const port = Number(process.env['PORT']);
  assert.ok(Number.isFinite(port), `no PORT envvar defined`);

  const app = await NestFactory.create(BookingReferenceModule);
  await app.listen(port);

  logger.log(`0.0.0.0:${port}`);
}
