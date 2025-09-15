import { ArgumentMetadata, BadRequestException, Logger, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger('ZodValidationPipe');

  constructor(private readonly schema: z.ZodType) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    return this.schema.parseAsync(value).catch((err) => {
      this.logger.error(err);
      throw new BadRequestException(err instanceof z.ZodError ? err.issues : err);
    });
  }
}
