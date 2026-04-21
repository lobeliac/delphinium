import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";

export class NotificationReadEvent extends DomainEvent {
  public readonly userID: ID;

  constructor(id: ID, userID: ID) {
    super(id);
    this.userID = userID;
  }
}
