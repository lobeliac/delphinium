import type { DomainEvent } from "@base/domain/event";

/**
 *  Represents a unique identifier for an entity.
 */
export type ID = string;

/**
 *  Represents the properties required to create a base entity.
 */
export type CreateEntityProps<T> = {
  /** The unique identifier for the entity. */
  _id: ID;
  /** The properties of the entity which will be given by class implementing base entity. */
  props: T;
  /** The date and time when the entity was created. */
  createdAt: Date;
  /** The date and time when the entity was last updated. */
  updatedAt: Date;
};

/**
 *  Represents the base entity class.
 */
export abstract class Entity<EntityProps> {
  protected readonly _id: ID;
  protected readonly _props: EntityProps;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  /**
   *  The domain events associated with the entity.
   */
  protected _domainEvents: DomainEvent[] = [];

  protected constructor(_id: ID, _props: EntityProps, _createdAt: Date, _updatedAt: Date) {
    this._id = _id;
    this._props = _props;
    this._createdAt = _createdAt;
    this._updatedAt = _updatedAt;
  }

  get id(): ID {
    return this._id;
  }

  get props(): EntityProps {
    return this._props;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  /**
   *  Gets and clears the domain events associated with the entity.
   *  @returns The domain events that were associated with the entity.
   */
  get getAndClearEvents(): DomainEvent[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const events: DomainEvent[] = [...this._domainEvents];
    this._domainEvents = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return events;
  }

  /**
   *  Adds a domain event to the entity.
   *  @param event The domain event to add.
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }
}
