import { createReadStream } from 'node:fs';
import { json } from 'node:stream/consumers';
import path from 'node:path';

import { DynamicModule, Module } from '@nestjs/common';
import { z } from 'zod';

@Module({})
export class ConfigModule {
  static async registerAsync(options: { schema: z.ZodType; token: Function }): Promise<DynamicModule> {
    const rawConfig = await json(createReadStream(path.join(import.meta.dirname, '..', 'config.json'), 'utf-8'));
    const config = await options.schema.parseAsync(rawConfig);

    return {
      module: ConfigModule,
      providers: [{ provide: options.token, useValue: config }],
      exports: [options.token],
    };
  }
}
