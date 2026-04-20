import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { DisplayName } from "../../domain/value-objects/index.ts";

/**
 * Event triggered when a new user profile is created.
 * Includes the account link and initial display name for downstream synchronization.
 */
export class UserRegisteredEvent extends DomainEvent {
  public readonly accountID: ID;
  public readonly displayName: DisplayName;

  constructor(userID: ID, accountID: ID, displayName: DisplayName) {
    super(userID);
    this.accountID = accountID;
    this.displayName = displayName;
  }
}
