import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

/**
 * Event triggered when an account is marked for deletion.
 */
export class AccountDeletedEvent extends DomainEvent {
  constructor(accountId: ID) {
    super(accountId);
  }
}
