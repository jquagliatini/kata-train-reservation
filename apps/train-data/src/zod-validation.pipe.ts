import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    return this.schema.parseAsync(value).catch((err) => {
      throw new BadRequestException(err instanceof z.ZodError ? err.issues : err);
    });
  }
}
