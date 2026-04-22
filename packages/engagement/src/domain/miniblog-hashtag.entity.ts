import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import type { HashtagVO } from "./value-objects/hashtag.value-object.ts";
import { MiniblogTaggedEvent } from "../events/miniblog-tagged.event.ts";
import { MiniblogUntaggedEvent } from "../events/miniblog-untagged.event.ts";

export type MiniblogHashtagProps = {
  miniblogID: ID;
  hashtag: HashtagVO;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents the association between a Miniblog and a Hashtag.
 */
export class MiniblogHashtag extends Entity<MiniblogHashtagProps> {
  protected constructor(id: ID, props: MiniblogHashtagProps) {
    super(id, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  public static create(
    props: Omit<MiniblogHashtagProps, "createdAt" | "updatedAt">,
    id?: ID
  ): MiniblogHashtag {
    const minblogHashtag = new MiniblogHashtag(id ?? crypto.randomUUID(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    minblogHashtag.addDomainEvent(
      new MiniblogTaggedEvent(minblogHashtag.id, props.miniblogID, props.hashtag)
    );

    return minblogHashtag;
  }

  /**
   * Reconstitutes an existing MiniblogHashtag from persistence without triggering events.
   */
  public static reconstitute(props: MiniblogHashtagProps, id: ID): MiniblogHashtag {
    return new MiniblogHashtag(id, props);
  }

  delete(): void {
    this.addDomainEvent(
      new MiniblogUntaggedEvent(this.id, this.props.miniblogID, this.props.hashtag)
    );
  }

  get miniblogID(): ID {
    return this.props.miniblogID;
  }

  get hashtag(): HashtagVO {
    return this.props.hashtag;
  }
}
