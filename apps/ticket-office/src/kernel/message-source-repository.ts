import assert from 'node:assert';

import { Ctor } from '../types.js';

import { Message, MessageSource } from './message-source.js';

type MessageOf<T> = T extends MessageSource<infer M extends Message<string>> ? M : never;
class PersistorBuilder<
  Source extends MessageSource<Message<string>>,
  Handled extends [MessageOf<Source>, unknown][] = [],
> {
  constructor(private readonly handlers = new Map<Function, (m: MessageOf<Source>) => unknown>()) {}

  build(): Map<Function, (m: MessageOf<Source>) => Handled[number][1]> {
    return this.handlers;
  }

  when<M extends Exclude<MessageOf<Source>, Handled[number][0]>, Result>(
    ctor: Ctor<M>,
    handler: (message: M) => Result,
  ): [Exclude<MessageOf<Source>, Handled[number][0] | M>] extends [never]
    ? Pick<PersistorBuilder<Source, [...Handled, [M, Result]]>, 'build'>
    : Pick<PersistorBuilder<Source, [...Handled, [M, Result]]>, 'when'> {
    this.handlers.set(ctor, handler as any);
    return this as any;
  }
}

export abstract class MessageSourceRepository<M extends MessageSource<Message<string>>> {
  abstract persist(source: M): unknown;

  protected with<Handled extends [MessageOf<M>, unknown][]>(
    factory: (builder: Pick<PersistorBuilder<M>, 'when'>) => Pick<PersistorBuilder<M, Handled>, 'build'>,
  ) {
    const handlers = factory(new PersistorBuilder()).build();

    return {
      persist: (source: M): Handled[number][1][] => {
        return source.messages.map((message) => {
          const handler = handlers.get(message.constructor);
          assert.ok(handler != null, `no handler for "${message.constructor.name}"`);

          return handler.call(this, message as MessageOf<M>);
        });
      },
    };
  }
}
