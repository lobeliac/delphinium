import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { UpdateMiniblogCommand } from "@slice/miniblog/commands";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import { TYPES } from "./create-miniblog.handler.ts";

@injectable()
export class UpdateMiniblogCommandHandler implements CommandHandler<UpdateMiniblogCommand> {
  private readonly miniblogRepo: MiniblogRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.MiniblogRepository) miniblogRepo: MiniblogRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.miniblogRepo = miniblogRepo;
    this.eventBus = eventBus;
  }

  async handle(command: UpdateMiniblogCommand): Promise<void> {
    const { miniblogId, content, visibility } = command.payload;

    const miniblogResult = await this.miniblogRepo.findById(miniblogId);
    if (!miniblogResult.ok) {
      throw miniblogResult.error;
    }

    const miniblog = miniblogResult.value;

    if (content) {
      miniblog.updateBlogContent(content);
    }

    if (visibility) {
      miniblog.updateVisibility(visibility);
    }

    await this.miniblogRepo.save(miniblog);

    for (const event of miniblog.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
