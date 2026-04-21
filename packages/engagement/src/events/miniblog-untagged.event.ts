import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { HashtagVO } from "../domain/value-objects/index.ts";

export class MiniblogUntaggedEvent extends DomainEvent {
  public readonly tagID: ID;
  public readonly miniblogID: ID;
  public readonly hashtag: HashtagVO;

  constructor(tagID: ID, miniblogID: ID, hashtag: HashtagVO) {
    super(tagID);
    this.tagID = tagID;
    this.miniblogID = miniblogID;
    this.hashtag = hashtag;
  }
}
