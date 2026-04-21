import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

export class CommentDeletedEvent extends DomainEvent {
  public readonly commentID: ID;
  public readonly userID: ID;
  public readonly miniblogID: ID;

  constructor(commentID: ID, userID: ID, miniblogID: ID) {
    super(commentID);
    this.commentID = commentID;
    this.userID = userID;
    this.miniblogID = miniblogID;
  }
}
