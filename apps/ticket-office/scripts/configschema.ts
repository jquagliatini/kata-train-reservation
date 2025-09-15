import * as fs from 'node:fs/promises';
import path from 'node:path';

import { z } from 'zod';

import { configSchema } from '../src/ticket-office-config.type.js';

main().catch(console.error);
async function main() {
  const schema = z.toJSONSchema(configSchema.extend({ $schema: z.literal('./config.schema.json') }));
  const output = path.join(import.meta.dirname, '..', 'config.schema.json');

  await fs.writeFile(output, JSON.stringify(schema, null, 2), 'utf-8');

  console.log('✔ done');
}
