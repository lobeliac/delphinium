import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type MarkNotificationReadPayload = {
  notificationID: ID;
};

export class MarkNotificationReadCommand extends BaseCommand<MarkNotificationReadPayload> {
  constructor(payload: MarkNotificationReadPayload) {
    super({ payload });
  }
}
