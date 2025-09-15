import { z } from 'zod';

export const ReserveRequestSchema = z.object({
  train_id: z.string(),
  seat_count: z.coerce.number().int(),
});
export type ReserveRequest = z.infer<typeof ReserveRequestSchema>;

const BRAND = Symbol();
export abstract class Branded<Brand extends string> {
  [BRAND]!: Brand;
}

export type Ctor<T> = new (...args: any[]) => T;
