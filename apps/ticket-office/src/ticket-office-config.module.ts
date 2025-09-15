import { Module } from '@nestjs/common';

import { ConfigModule } from './config.js';
import { configSchema, TicketOfficeConfig } from './ticket-office-config.type.js';

@Module({
  exports: [ConfigModule],
  imports: [ConfigModule.registerAsync({ token: TicketOfficeConfig, schema: configSchema })],
})
export class TicketOfficeConfigModule {}
