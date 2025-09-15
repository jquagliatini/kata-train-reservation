import z from 'zod';

export const ReserveRequestSchema = z.object({
  train_id: z.string(),
  seat_count: z.number().int(),
});
export type ReserveRequest = z.infer<typeof ReserveRequestSchema>;
