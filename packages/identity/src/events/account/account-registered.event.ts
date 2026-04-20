import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

/**
 * Event triggered when a new account is successfully created.
 */
export class AccountRegisteredEvent extends DomainEvent {
  constructor(accountID: ID) {
    super(accountID);
  }
}
