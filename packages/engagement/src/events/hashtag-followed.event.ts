import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { HashtagVO } from "../domain/value-objects/index.ts";

export class HashtagFollowedEvent extends DomainEvent {
  public readonly userID: ID;
  public readonly hashtag: HashtagVO;

  constructor(id: ID, userID: ID, hashtag: HashtagVO) {
    super(id);
    this.userID = userID;
    this.hashtag = hashtag;
  }
}
