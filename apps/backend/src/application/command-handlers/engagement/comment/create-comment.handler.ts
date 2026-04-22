import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { CreateCommentCommand } from "@slice/engagement/commands";
import type { CommentRepository } from "@slice/engagement/repository";
import { Comment, CommentContent } from "@slice/engagement/domain";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class CreateCommentCommandHandler implements CommandHandler<CreateCommentCommand> {
  private readonly commentRepo: CommentRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.CommentRepository) commentRepo: CommentRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.commentRepo = commentRepo;
    this.eventBus = eventBus;
  }

  async handle(command: CreateCommentCommand): Promise<void> {
    const { userID, miniblogID, content } = command.payload;

    const contentResult = CommentContent.create(content);
    if (!contentResult.ok) {
      throw contentResult.error;
    }

    const comment = Comment.create({
      userID,
      miniblogID,
      content: contentResult.value
    });

    await this.commentRepo.save(comment);

    for (const event of comment.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
