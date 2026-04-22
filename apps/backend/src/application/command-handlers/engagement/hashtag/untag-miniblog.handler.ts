import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { UntagMiniblogCommand } from "@slice/engagement/commands";
import type { MiniblogHashtagRepository } from "@slice/engagement/repository";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class UntagMiniblogCommandHandler implements CommandHandler<UntagMiniblogCommand> {
  private readonly mbHashtagRepo: MiniblogHashtagRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.MiniblogHashtagRepository) mbHashtagRepo: MiniblogHashtagRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.mbHashtagRepo = mbHashtagRepo;
    this.eventBus = eventBus;
  }

  async handle(command: UntagMiniblogCommand): Promise<void> {
    const { miniblogID, hashtag } = command.payload;

    const tags = await this.mbHashtagRepo.findByMiniblog(miniblogID);
    const tag = tags.find((t) => t.hashtag.value === hashtag);

    if (tag) {
      tag.delete();
      await this.mbHashtagRepo.deleteByMiniblogAndHashtag(miniblogID, hashtag);
      for (const event of tag.getAndClearEvents) {
        await this.eventBus.publish(event);
      }
    }
  }
}
