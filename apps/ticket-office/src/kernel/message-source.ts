import { Branded } from '../types.js';

export abstract class Message<Brand extends string> extends Branded<Brand> {
  [k: string]:
    | string
    | number
    | boolean
    | null
    | Record<string, string | number | boolean | null | (string | number | boolean | null)[]>
    | (string | number | boolean | null | Record<string, string | number | boolean | null>)[];
}

export abstract class MessageSource<M extends Message<string>> {
  readonly #messages: M[] = [];

  get messages(): M[] {
    return this.#messages;
  }

  pushMessage(message: M): void {
    this.#messages.push(message);
  }
}
