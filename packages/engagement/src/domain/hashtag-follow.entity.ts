import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import type { HashtagVO } from "./value-objects/hashtag.value-object.ts";
import { HashtagFollowedEvent } from "../events/hashtag-followed.event.ts";
import { HashtagUnfollowedEvent } from "../events/hashtag-unfollowed.event.ts";

export type HashtagFollowProps = {
  userID: ID;
  hashtag: HashtagVO;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents a user following a specific hashtag.
 */
export class HashtagFollow extends Entity<HashtagFollowProps> {
  protected constructor(id: ID, props: HashtagFollowProps) {
    super(id, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  public static create(
    props: Omit<HashtagFollowProps, "createdAt" | "updatedAt">,
    id?: ID
  ): HashtagFollow {
    const follow = new HashtagFollow(id ?? crypto.randomUUID(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    follow.addDomainEvent(new HashtagFollowedEvent(follow.id, props.userID, props.hashtag));

    return follow;
  }

  /**
   * Reconstitutes an existing HashtagFollow from persistence without triggering events.
   */
  public static reconstitute(props: HashtagFollowProps, id: ID): HashtagFollow {
    return new HashtagFollow(id, props);
  }

  delete(): void {
    this.addDomainEvent(new HashtagUnfollowedEvent(this.id, this.props.userID, this.props.hashtag));
  }

  get userID(): ID {
    return this.props.userID;
  }

  get hashtag(): HashtagVO {
    return this.props.hashtag;
  }
}
