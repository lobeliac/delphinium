import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { RemoveLikeCommand } from "@slice/engagement/commands";
import type { LikeRepository } from "@slice/engagement/repository";
import { TYPES } from "./create-like.handler.ts";

@injectable()
export class RemoveLikeCommandHandler implements CommandHandler<RemoveLikeCommand> {
  private readonly likeRepo: LikeRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.LikeRepository) likeRepo: LikeRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.likeRepo = likeRepo;
    this.eventBus = eventBus;
  }

  async handle(command: RemoveLikeCommand): Promise<void> {
    const { userID, miniblogID } = command.payload;

    const likeResult = await this.likeRepo.findByUserAndBlog(userID, miniblogID);
    if (!likeResult.ok) {
      throw likeResult.error;
    }

    const like = likeResult.value;

    like.delete();

    await this.likeRepo.delete(like);

    for (const event of like.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
