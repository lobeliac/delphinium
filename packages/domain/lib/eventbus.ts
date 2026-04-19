/**
 * Represents a contract for a system capable of publishing and subscribing to domain events.
 * Used to facilitate asynchronous communication between different parts of the domain.
 */
export type EventBus = {
  /**
   * Dispatches a domain event to all registered subscribers.
   * @param event - The domain event to be published.
   * @returns A promise that resolves when the event has been published.
   */
  publish: (event: DomainEvent) => Promise<void>;

  /**
   * Registers a handler to be executed when a specific type of event is published.
   * @param eventName - The constructor of the DomainEvent class to listen for. (Easier than using a string name)
   * @param handler - The callback function to execute when the event occurs.
   * @returns A promise that resolves when the subscription is successful.
   */
  subscribe: (
    eventName: new (...args: any[]) => DomainEvent,
    handler: (event: DomainEvent) => void
  ) => Promise<void>;
};

/**
 * Base class for all domain events.
 * Domain events represent something that has happened in the past within the domain.
 */
export abstract class DomainEvent {
  /** The unique identifier for this specific event instance. */
  public readonly id: string;
  /** The timestamp representing when the event occurred. */
  public readonly timestamp: number;
  /** The identifier of the entity that triggered this event. */
  public readonly entityId: string;

  /**
   * @param entityId - The ID of the entity associated with this event.
   */
  protected constructor(entityId: string) {
    this.id = crypto.randomUUID();
    this.timestamp = Date.now();
    this.entityId = entityId;
  }
}
