import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import assert from 'node:assert';
import { TicketOfficeModule } from './ticket-office.module.js';

const logger = new Logger(`🎫 Ticket Office`);

main().catch((err) => logger.fatal(err));
async function main() {
  const port = Number(process.env['PORT']);
  assert.ok(Number.isFinite(port), 'no PORT envvar available');

  const app = await NestFactory.create(TicketOfficeModule);
  await app.listen(port);

  logger.log(`0.0.0.0:${port}`);
}
