import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

export class LikeRemovedEvent extends DomainEvent {
  public readonly likeID: ID;
  public readonly userID: ID;
  public readonly miniblogID: ID;

  constructor(likeID: ID, userID: ID, miniblogID: ID) {
    super(likeID);
    this.likeID = likeID;
    this.userID = userID;
    this.miniblogID = miniblogID;
  }
}
