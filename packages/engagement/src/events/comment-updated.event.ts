import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { CommentContent } from "../domain/value-objects/index.ts";

export class CommentUpdatedEvent extends DomainEvent {
  public readonly commentID: ID;
  public readonly content: CommentContent;

  constructor(commentID: ID, content: CommentContent) {
    super(commentID);
    this.commentID = commentID;
    this.content = content;
  }
}
