import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { MarkNotificationReadCommand } from "@slice/engagement/commands";
import type { NotificationRepository } from "@slice/engagement/repository";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class MarkNotificationReadCommandHandler implements CommandHandler<MarkNotificationReadCommand> {
  private readonly notifRepo: NotificationRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.NotificationRepository) notifRepo: NotificationRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.notifRepo = notifRepo;
    this.eventBus = eventBus;
  }

  async handle(command: MarkNotificationReadCommand): Promise<void> {
    const { notificationID } = command.payload;

    const notifResult = await this.notifRepo.findById(notificationID);
    if (!notifResult.ok) {
      throw notifResult.error;
    }

    const notif = notifResult.value;

    notif.markAsRead();

    await this.notifRepo.save(notif);

    for (const event of notif.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
