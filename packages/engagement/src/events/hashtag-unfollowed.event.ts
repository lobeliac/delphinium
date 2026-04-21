import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { HashtagVO } from "../domain/value-objects/index.ts";

export class HashtagUnfollowedEvent extends DomainEvent {
  public readonly followID: ID;
  public readonly userID: ID;
  public readonly hashtag: HashtagVO;

  constructor(followID: ID, userID: ID, hashtag: HashtagVO) {
    super(followID);
    this.followID = followID;
    this.userID = userID;
    this.hashtag = hashtag;
  }
}
