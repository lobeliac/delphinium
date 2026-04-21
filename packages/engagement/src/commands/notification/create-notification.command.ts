import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { NotificationType } from "../../domain/notification.entity.ts";

export type CreateNotificationPayload = {
  userID: ID;
  actorID: ID;
  type: NotificationType;
  referenceID: ID;
};

export class CreateNotificationCommand extends BaseCommand<CreateNotificationPayload> {
  constructor(payload: CreateNotificationPayload) {
    super({ payload });
  }
}
