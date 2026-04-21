import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { NotificationType } from "../domain/notification.entity.ts";

export class NotificationCreatedEvent extends DomainEvent {
  public readonly userID: ID;
  public readonly actorID: ID;
  public readonly type: NotificationType;
  public readonly referenceID: ID;

  constructor(id: ID, userID: ID, actorID: ID, type: NotificationType, referenceID: ID) {
    super(id);
    this.userID = userID;
    this.actorID = actorID;
    this.type = type;
    this.referenceID = referenceID;
  }
}
