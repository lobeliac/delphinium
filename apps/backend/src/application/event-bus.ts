import { injectable } from "inversify";
import type { EventBus, DomainEvent } from "@base/domain/event";

@injectable()
export class BackendEventBus implements EventBus {
  private readonly handlers = new Map<string, Array<(event: DomainEvent) => void>>();

  public async publish(event: DomainEvent): Promise<void> {
    console.log(`[DomainEvent] Published: ${event.constructor.name}`, {
      entityId: event.entityId,
      eventId: event.id,
      timestamp: new Date(event.timestamp).toISOString()
    });

    const eventName = event.constructor.name;
    const eventHandlers = this.handlers.get(eventName) ?? [];

    // Execute all handlers concurrently
    await Promise.all(eventHandlers.map(async (handler) => Promise.resolve(handler(event))));
  }

  public async subscribe(
    eventClass: new (...args: any[]) => DomainEvent,
    handler: (event: DomainEvent) => void
  ): Promise<void> {
    const eventName = eventClass.name;
    const existingHandlers = this.handlers.get(eventName) ?? [];
    existingHandlers.push(handler);
    this.handlers.set(eventName, existingHandlers);

    console.log(`[EventBus] Subscribed to ${eventName}`);
  }
}
