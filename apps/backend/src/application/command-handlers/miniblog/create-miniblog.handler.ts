import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { CreateMiniblogCommand } from "@slice/miniblog/commands";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import { Miniblog, MiniblogVisibilityEnum, MiniblogVisibilityVO } from "@slice/miniblog/domain";

export const TYPES = {
  MiniblogRepository: Symbol.for("MiniblogRepository"),
  EventBus: Symbol.for("EventBus")
};

@injectable()
export class CreateMiniblogCommandHandler implements CommandHandler<CreateMiniblogCommand> {
  private readonly miniblogRepo: MiniblogRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.MiniblogRepository) miniblogRepo: MiniblogRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.miniblogRepo = miniblogRepo;
    this.eventBus = eventBus;
  }

  async handle(command: CreateMiniblogCommand): Promise<void> {
    const { authorId, content, visibility } = command.payload;

    const finalVisibility =
      visibility ?? MiniblogVisibilityVO.create(MiniblogVisibilityEnum.PUBLIC);

    const miniblog = Miniblog.create({
      authorID: authorId,
      content,
      visibility: finalVisibility
    });

    await this.miniblogRepo.save(miniblog);

    for (const event of miniblog.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
