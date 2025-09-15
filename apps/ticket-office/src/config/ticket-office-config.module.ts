import { json } from 'node:stream/consumers';
import { createReadStream } from 'node:fs';
import path from 'node:path';

import { DynamicModule, Module } from '@nestjs/common';

import { configSchema, TicketOfficeConfig } from './ticket-office-config.type.js';

@Module({})
export class TicketOfficeConfigModule {
  static async registerAsync(): Promise<DynamicModule> {
    const rawConfig = await json(createReadStream(path.join(import.meta.dirname, '..', '..', 'config.json'), 'utf-8'));
    const config = await configSchema.parseAsync(rawConfig);

    return {
      module: TicketOfficeConfigModule,
      providers: [{ provide: TicketOfficeConfig, useValue: config }],
      exports: [TicketOfficeConfig],
    };
  }
}
