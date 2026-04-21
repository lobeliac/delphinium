import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import type { MiniblogContent, MiniblogVisibilityVO } from "./value-objects/index.ts";
import { MiniblogCreatedEvent } from "../events/miniblog-created.event.ts";
import { MiniblogUpdatedEvent } from "../events/miniblog-updated.event.ts";
import { MiniblogDeletedEvent } from "../events/miniblog-deleted.event.ts";

type MiniblogProps = {
  authorID: ID;
  content: MiniblogContent;
  visibility: MiniblogVisibilityVO;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents a Miniblog entity in the domain.
 * A miniblog has an author, content, and visibility status.
 */
export class Miniblog extends Entity<MiniblogProps> {
  protected constructor(blogID: ID, props: MiniblogProps) {
    super(blogID, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  /**
   * Creates a new instance of Miniblog.
   *
   * @param props The initial properties of the miniblog.
   * @param blogID Optional unique identifier for the blog.
   * @returns A new Miniblog instance with a MiniblogCreatedEvent.
   */
  public static create(
    props: Omit<MiniblogProps, "createdAt" | "updatedAt">,
    blogID?: ID
  ): Miniblog {
    const miniblog = new Miniblog(blogID ?? crypto.randomUUID(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const miniblogEvent = new MiniblogCreatedEvent(miniblog.id, props.authorID, props.visibility);
    miniblog.addDomainEvent(miniblogEvent);
    return miniblog;
  }

  /**
   * Updates the content of the miniblog.
   *
   * @param newBlogContent The new content to be set.
   */
  updateBlogContent(newBlogContent: MiniblogContent): void {
    this.props.content = newBlogContent;
    this.props.updatedAt = new Date();
    const miniblogEvent = new MiniblogUpdatedEvent({ blogID: this.id, content: newBlogContent });
    this.addDomainEvent(miniblogEvent);
  }

  /**
   * Updates the visibility status of the miniblog.
   *
   * @param newVisibility The new visibility status to be set.
   */
  updateVisibility(newVisibility: MiniblogVisibilityVO): void {
    this.props.visibility = newVisibility;
    this.props.updatedAt = new Date();
    const miniblogEvent = new MiniblogUpdatedEvent({ blogID: this.id, visibility: newVisibility });
    this.addDomainEvent(miniblogEvent);
  }

  /**
   * Marks the miniblog for deletion by adding a MiniblogDeletedEvent.
   */
  delete(): void {
    this.addDomainEvent(new MiniblogDeletedEvent(this.id, this.props.authorID));
  }

  get authorID(): ID {
    return this.props.authorID;
  }

  get visibility(): MiniblogVisibilityVO {
    return this.props.visibility;
  }

  get content(): MiniblogContent {
    return this.props.content;
  }
}
