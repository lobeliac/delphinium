import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { CreateNotificationCommand } from "@slice/engagement/commands";
import type { NotificationRepository } from "@slice/engagement/repository";
import { Notification } from "@slice/engagement/domain";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class CreateNotificationCommandHandler implements CommandHandler<CreateNotificationCommand> {
  private readonly notifRepo: NotificationRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.NotificationRepository) notifRepo: NotificationRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.notifRepo = notifRepo;
    this.eventBus = eventBus;
  }

  async handle(command: CreateNotificationCommand): Promise<void> {
    const { userID, actorID, type, referenceID } = command.payload;

    const notif = Notification.create({
      userID,
      actorID,
      type,
      referenceID
    });

    await this.notifRepo.save(notif);

    for (const event of notif.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
