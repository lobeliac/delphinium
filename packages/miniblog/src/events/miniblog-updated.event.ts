import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { MiniblogContent, MiniblogVisibilityVO } from "../domain/value-objects/index.ts";

/**
 * Payload for the MiniblogUpdatedEvent.
 */
export type MiniblogUpdatedEventPayload = {
  /** The ID of the blog being updated. */
  blogID: ID;
  /** The new visibility status, if changed. */
  visibility?: MiniblogVisibilityVO;
  /** The new content, if changed. */
  content?: MiniblogContent;
};

/**
 * Event triggered when a miniblog's content or visibility is updated.
 */
export class MiniblogUpdatedEvent extends DomainEvent {
  private readonly props: MiniblogUpdatedEventPayload;

  constructor(miniblogUpdatedEventPayload: MiniblogUpdatedEventPayload) {
    super(miniblogUpdatedEventPayload.blogID);
    this.props = miniblogUpdatedEventPayload;
  }

  /** The updated visibility status, if provided. */
  get visibility(): MiniblogVisibilityVO | undefined {
    return this.props.visibility;
  }

  /** The updated content, if provided. */
  get content(): MiniblogContent | undefined {
    return this.props.content;
  }
}
