import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { UpdateCommentCommand } from "@slice/engagement/commands";
import { CommentContent } from "@slice/engagement/domain";
import type { CommentRepository } from "@slice/engagement/repository";
import { TYPES } from "../like/create-like.handler.ts";

@injectable()
export class UpdateCommentCommandHandler implements CommandHandler<UpdateCommentCommand> {
  private readonly commentRepo: CommentRepository;
  private readonly eventBus: EventBus;

  constructor(
    @inject(TYPES.CommentRepository) commentRepo: CommentRepository,
    @inject(TYPES.EventBus) eventBus: EventBus
  ) {
    this.commentRepo = commentRepo;
    this.eventBus = eventBus;
  }

  async handle(command: UpdateCommentCommand): Promise<void> {
    const { commentID, content } = command.payload;

    const commentResult = await this.commentRepo.findById(commentID);
    if (!commentResult.ok) {
      throw commentResult.error;
    }

    const comment = commentResult.value;

    const contentResult = CommentContent.create(content);
    if (!contentResult.ok) {
      throw contentResult.error;
    }
    comment.updateContent(contentResult.value);

    await this.commentRepo.save(comment);

    for (const event of comment.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
