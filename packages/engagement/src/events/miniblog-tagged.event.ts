import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { HashtagVO } from "../domain/value-objects/index.ts";

export class MiniblogTaggedEvent extends DomainEvent {
  public readonly miniblogID: ID;
  public readonly hashtag: HashtagVO;

  constructor(id: ID, miniblogID: ID, hashtag: HashtagVO) {
    super(id);
    this.miniblogID = miniblogID;
    this.hashtag = hashtag;
  }
}
