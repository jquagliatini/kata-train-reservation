import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const ticketOfficeUrl = z.url().and(z.string().regex(/[^/]$/));

export const configSchema = z.object({
  outbound: z.object({ bookingReference: ticketOfficeUrl, trainData: ticketOfficeUrl }),
});
type InnerTicketOfficeConfiguration = z.infer<typeof configSchema>;

export interface TicketOfficeConfig extends InnerTicketOfficeConfiguration {}

@Injectable()
export class TicketOfficeConfig implements InnerTicketOfficeConfiguration {}
