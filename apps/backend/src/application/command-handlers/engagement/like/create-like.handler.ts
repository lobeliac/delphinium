import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { CreateLikeCommand } from "@slice/engagement/commands";
import type { LikeRepository } from "@slice/engagement/repository";
import { Like } from "@slice/engagement/domain";

export const TYPES = {
  LikeRepository: Symbol.for("LikeRepository"),
  CommentRepository: Symbol.for("CommentRepository"),
  HashtagFollowRepository: Symbol.for("HashtagFollowRepository"),
  MiniblogHashtagRepository: Symbol.for("MiniblogHashtagRepository"),
  NotificationRepository: Symbol.for("NotificationRepository"),
  EventBus: Symbol.for("EventBus")
};

@injectable()
export class CreateLikeCommandHandler implements CommandHandler<CreateLikeCommand> {
  private readonly likeRepo: LikeRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.LikeRepository) likeRepo: LikeRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.likeRepo = likeRepo;
    this.eventBus = eventBus;
  }

  async handle(command: CreateLikeCommand): Promise<void> {
    const { userID, miniblogID } = command.payload;

    const like = Like.create({
      userID,
      miniblogID
    });

    await this.likeRepo.save(like);

    for (const event of like.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
