import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import { LikeCreatedEvent } from "../events/like-created.event.ts";
import { LikeRemovedEvent } from "../events/like-removed.event.ts";

export type LikeProps = {
  userID: ID;
  miniblogID: ID;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents a Like entity in the engagement domain.
 * Connects a user with a miniblog they liked.
 */
export class Like extends Entity<LikeProps> {
  protected constructor(likeID: ID, props: LikeProps) {
    super(likeID, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  /**
   * Creates a new instance of Like.
   *
   * @param props The initial properties of the Like.
   * @param likeID Optional unique identifier for the Like.
   * @returns A new Like instance with a LikeCreatedEvent.
   */
  public static create(props: Omit<LikeProps, "createdAt" | "updatedAt">, likeID?: ID): Like {
    const like = new Like(likeID ?? crypto.randomUUID(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const likeEvent = new LikeCreatedEvent(like.id, props.userID, props.miniblogID);
    like.addDomainEvent(likeEvent);
    return like;
  }

  /**
   * Marks the Like for deletion by adding a LikeRemovedEvent.
   */
  delete(): void {
    this.addDomainEvent(new LikeRemovedEvent(this.id, this.props.userID, this.props.miniblogID));
  }

  get userID(): ID {
    return this.props.userID;
  }

  get miniblogID(): ID {
    return this.props.miniblogID;
  }
}
