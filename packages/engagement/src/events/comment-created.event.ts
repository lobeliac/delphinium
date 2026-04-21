import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { CommentContent } from "../domain/value-objects/index.ts";

export class CommentCreatedEvent extends DomainEvent {
  public readonly commentID: ID;
  public readonly userID: ID;
  public readonly miniblogID: ID;
  public readonly content: CommentContent;

  constructor(commentID: ID, userID: ID, miniblogID: ID, content: CommentContent) {
    super(commentID);
    this.commentID = commentID;
    this.userID = userID;
    this.miniblogID = miniblogID;
    this.content = content;
  }
}
