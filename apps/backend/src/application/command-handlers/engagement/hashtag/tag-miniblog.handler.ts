import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { TagMiniblogCommand } from "@slice/engagement/commands";
import type { MiniblogHashtagRepository } from "@slice/engagement/repository";
import { MiniblogHashtag, HashtagVO } from "@slice/engagement/domain";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class TagMiniblogCommandHandler implements CommandHandler<TagMiniblogCommand> {
  private readonly mbHashtagRepo: MiniblogHashtagRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.MiniblogHashtagRepository) mbHashtagRepo: MiniblogHashtagRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.mbHashtagRepo = mbHashtagRepo;
    this.eventBus = eventBus;
  }

  async handle(command: TagMiniblogCommand): Promise<void> {
    const { miniblogID, hashtag } = command.payload;

    const hashtagResult = HashtagVO.create(hashtag);
    if (!hashtagResult.ok) {
      throw hashtagResult.error;
    }

    const mbHashtag = MiniblogHashtag.create({
      miniblogID,
      hashtag: hashtagResult.value
    });

    await this.mbHashtagRepo.save(mbHashtag);

    for (const event of mbHashtag.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
