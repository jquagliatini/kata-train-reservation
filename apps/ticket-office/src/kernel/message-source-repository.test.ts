import { randomUUID } from 'node:crypto';

import { describe, it } from '../../tests/fixtures.js';

import { Message, MessageSource } from './message-source.js';
import { MessageSourceRepository } from './message-source-repository.js';

class PersonCreated extends Message<'PersonCreated'> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly age: number,
  ) {
    super();
  }
}

class PersonAged extends Message<'PersonAged'> {
  constructor(
    readonly id: string,
    readonly age: number,
  ) {
    super();
  }
}

class Person extends MessageSource<PersonCreated | PersonAged> {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly age: number,
  ) {
    super();
  }

  ageUp(): void {
    this.pushMessage(new PersonAged(this.id, this.age + 1));
  }

  static create(props: { name: string; age: number }): Person {
    const person = new Person(randomUUID(), props.name, props.age);
    person.pushMessage(new PersonCreated(person.id, person.name, person.age));

    return person;
  }
}

class PersonRepository extends MessageSourceRepository<Person> {
  override persist(source: Person): Promise<(1 | 2)[]> {
    return Promise.all(
      this.with((match) =>
        match.when(PersonCreated, this.persistPersonCreated).when(PersonAged, this.persistPersonAged),
      ).persist(source),
    );
  }

  private persistPersonCreated(_: PersonCreated) {
    return Promise.resolve(1 as const);
  }

  private persistPersonAged(_: PersonAged) {
    return Promise.resolve(2 as const);
  }
}

describe('MessageSourceRepository', () => {
  it('should throw a compilation error, when not all events are handler', ({ expect }) => {
    class IncompletePersonRepository extends MessageSourceRepository<Person> {
      override persist(person: Person): unknown {
        return this.with((b) =>
          // @ts-expect-error
          b.when(PersonCreated, () => 2 as const),
        ).persist(person);
      }
    }

    expect(new IncompletePersonRepository()).not.toBeNull();
  });

  it('should run handlers', async ({ expect }) => {
    const repo = new PersonRepository();
    const person = Person.create({ name: 'Alex', age: 30 });

    const [result] = await repo.persist(person);
    expect(result).toBe(1);
  });
});
