import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { MiniblogVisibilityVO } from "../domain/value-objects/index.ts";

/**
 * Event triggered when a new miniblog is created.
 */
export class MiniblogCreatedEvent extends DomainEvent {
  /** The ID of the user who created the blog. */
  public readonly authorID: ID;
  /** The initial visibility status of the blog. */
  public readonly visibility: MiniblogVisibilityVO;

  constructor(blogID: ID, authorID: ID, visibility: MiniblogVisibilityVO) {
    super(blogID);
    this.authorID = authorID;
    this.visibility = visibility;
  }
}
