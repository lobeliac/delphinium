import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { UnfollowHashtagCommand } from "@slice/engagement/commands";
import type { HashtagFollowRepository } from "@slice/engagement/repository";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class UnfollowHashtagCommandHandler implements CommandHandler<UnfollowHashtagCommand> {
  private readonly followRepo: HashtagFollowRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.HashtagFollowRepository) followRepo: HashtagFollowRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.followRepo = followRepo;
    this.eventBus = eventBus;
  }

  async handle(command: UnfollowHashtagCommand): Promise<void> {
    const { userID, hashtag } = command.payload;

    const follows = await this.followRepo.findByUser(userID);
    const follow = follows.find((f) => f.hashtag.value === hashtag);

    if (follow) {
      follow.delete();
      await this.followRepo.deleteByUserAndHashtag(userID, hashtag);
      for (const event of follow.getAndClearEvents) {
        await this.eventBus.publish(event);
      }
    }
  }
}
