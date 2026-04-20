import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

/**
 * Event triggered when an account's password is changed.
 */
export class PasswordUpdatedEvent extends DomainEvent {
  constructor(accountId: ID) {
    super(accountId);
  }
}
