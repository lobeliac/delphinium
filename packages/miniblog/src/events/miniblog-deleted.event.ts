import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

/**
 * Event triggered when a miniblog is deleted.
 */
export class MiniblogDeletedEvent extends DomainEvent {
  /** The ID of the user who deleted the blog. */
  public readonly authorID: ID;

  constructor(blogID: ID, authorID: ID) {
    super(blogID);
    this.authorID = authorID;
  }
}
