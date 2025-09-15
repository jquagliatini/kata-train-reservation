import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from 'nestjs-undici';
import { z } from 'zod';
import { firstValueFrom } from 'rxjs';

import { TicketOfficeConfig } from '../config/ticket-office-config.type.js';

const trainSchema = z.object({
  seats: z.record(z.string(), z.object({ coach: z.string(), seat_number: z.string(), booking_reference: z.string() })),
});

type TrainDataTrain = z.infer<typeof trainSchema>;

export interface TrainDataService {
  getTrain(id: string): Promise<TrainDataTrain | null>;
  book(request: { train_id: string; seats: string[]; booking_reference: string }): Promise<void>;
}

export const TRAIN_DATA_SERVICE_TOKEN = Symbol();

@Injectable()
export class HttpTrainDataService implements TrainDataService {
  private readonly trainDataBaseUrl: string;
  private readonly logger = new Logger('HtpTrainDataService');

  constructor(
    private readonly http: HttpService,
    config: TicketOfficeConfig,
  ) {
    this.trainDataBaseUrl = config.outbound.trainData;
  }

  async getTrain(id: string): Promise<TrainDataTrain | null> {
    const url = new URL(`${this.trainDataBaseUrl}/data_for_train/${id}`);
    const { statusCode, body } = await firstValueFrom(this.http.request(url, { method: 'GET' }));

    if (statusCode >= 400) {
      this.logger.error(`status code ${statusCode}`);
      throw new InternalServerErrorException();
    }

    const rawTrain = await body.json();
    return trainSchema.nullable().parseAsync(rawTrain);
  }

  async book(request: { train_id: string; seats: string[]; booking_reference: string }): Promise<void> {
    const url = new URL(`${this.trainDataBaseUrl}/reserve`);
    const { statusCode } = await firstValueFrom(
      this.http.request(url, {
        method: 'POST',
        idempotent: true,
        body: JSON.stringify(request),
        headers: { 'content-type': 'application/json' },
      }),
    );

    if (statusCode >= 400) {
      this.logger.error(`status code ${statusCode}`);
      throw new InternalServerErrorException();
    }
  }
}
