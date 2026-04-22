import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { FollowHashtagCommand } from "@slice/engagement/commands";
import type { HashtagFollowRepository } from "@slice/engagement/repository";
import { HashtagFollow, HashtagVO } from "@slice/engagement/domain";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class FollowHashtagCommandHandler implements CommandHandler<FollowHashtagCommand> {
  private readonly followRepo: HashtagFollowRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.HashtagFollowRepository) followRepo: HashtagFollowRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.followRepo = followRepo;
    this.eventBus = eventBus;
  }

  async handle(command: FollowHashtagCommand): Promise<void> {
    const { userID, hashtag } = command.payload;

    const hashtagResult = HashtagVO.create(hashtag);
    if (!hashtagResult.ok) {
      throw hashtagResult.error;
    }

    const follow = HashtagFollow.create({
      userID,
      hashtag: hashtagResult.value
    });

    await this.followRepo.save(follow);

    for (const event of follow.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
