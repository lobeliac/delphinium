import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";
import { NotificationCreatedEvent } from "../events/notification-created.event.ts";
import { NotificationReadEvent } from "../events/notification-read.event.ts";

export const NotificationType = {
  LIKE: "LIKE",
  COMMENT: "COMMENT",
  HASHTAG_POST: "HASHTAG_POST"
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export type NotificationProps = {
  userID: ID; // The recipient
  actorID: ID; // The actor who triggered the notification
  type: NotificationType;
  referenceID: ID; // The target entity ID (miniblogID, commentID, likeID)
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Represents a user notification for engagement activities.
 */
export class Notification extends Entity<NotificationProps> {
  protected constructor(id: ID, props: NotificationProps) {
    super(id, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  public static create(
    props: Omit<NotificationProps, "isRead" | "createdAt" | "updatedAt">,
    id?: ID
  ): Notification {
    const notification = new Notification(id ?? crypto.randomUUID(), {
      ...props,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    notification.addDomainEvent(
      new NotificationCreatedEvent(
        notification.id,
        props.userID,
        props.actorID,
        props.type,
        props.referenceID
      )
    );

    return notification;
  }

  /**
   * Reconstitutes an existing Notification from persistence without triggering events.
   */
  public static reconstitute(props: NotificationProps, id: ID): Notification {
    return new Notification(id, props);
  }

  public markAsRead(): void {
    if (this.props.isRead) {
      return;
    }

    this.props.isRead = true;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new NotificationReadEvent(this.id, this.props.userID));
  }

  get userID(): ID {
    return this.props.userID;
  }

  get actorID(): ID {
    return this.props.actorID;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get referenceID(): ID {
    return this.props.referenceID;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }
}
