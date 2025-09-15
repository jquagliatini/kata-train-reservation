import { Branded } from '../types.js';

export class BookingReference extends Branded<'BookingReference'> {
  constructor(private readonly value: string) {
    super();
  }

  override toString(): string {
    return this.value;
  }
}
