import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import type { CommentContent } from "./value-objects/index.ts";
import { CommentCreatedEvent } from "../events/comment-created.event.ts";
import { CommentUpdatedEvent } from "../events/comment-updated.event.ts";
import { CommentDeletedEvent } from "../events/comment-deleted.event.ts";

export type CommentProps = {
  userID: ID;
  miniblogID: ID;
  content: CommentContent;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents a Comment entity in the engagement domain.
 * Connects a user with a miniblog through text content.
 */
export class Comment extends Entity<CommentProps> {
  protected constructor(commentID: ID, props: CommentProps) {
    super(commentID, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  /**
   * Creates a new instance of Comment.
   *
   * @param props The initial properties of the comment.
   * @param commentID Optional unique identifier for the comment.
   * @returns A new Comment instance with a CommentCreatedEvent.
   */
  public static create(
    props: Omit<CommentProps, "createdAt" | "updatedAt">,
    commentID?: ID
  ): Comment {
    const comment = new Comment(commentID ?? crypto.randomUUID(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const commentEvent = new CommentCreatedEvent(
      comment.id,
      props.userID,
      props.miniblogID,
      props.content
    );
    comment.addDomainEvent(commentEvent);
    return comment;
  }

  /**
   * Reconstitutes an existing Comment from persistence without triggering events.
   */
  public static reconstitute(props: CommentProps, commentID: ID): Comment {
    return new Comment(commentID, props);
  }

  /**
   * Updates the content of the comment.
   *
   * @param newContent The new content to be set.
   */
  updateContent(newContent: CommentContent): void {
    this.props.content = newContent;
    this.props.updatedAt = new Date();
    const commentEvent = new CommentUpdatedEvent(this.id, newContent);
    this.addDomainEvent(commentEvent);
  }

  /**
   * Marks the comment for deletion by adding a CommentDeletedEvent.
   */
  delete(): void {
    this.addDomainEvent(new CommentDeletedEvent(this.id, this.props.userID, this.props.miniblogID));
  }

  get userID(): ID {
    return this.props.userID;
  }

  get miniblogID(): ID {
    return this.props.miniblogID;
  }

  get content(): CommentContent {
    return this.props.content;
  }
}
