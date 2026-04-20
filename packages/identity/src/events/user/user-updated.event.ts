import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { Bio, DisplayName } from "../../domain/value-objects/index.js";

/**
 * Event triggered when a user's profile details (bio or display name) are modified.
 */
export class UserUpdatedEvent extends DomainEvent {
  public readonly bio?: Bio;
  public readonly displayName?: DisplayName;

  constructor(userID: ID, bio?: Bio, displayName?: DisplayName) {
    super(userID);
    this.bio = bio;
    this.displayName = displayName;
  }
}
