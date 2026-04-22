import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { DeleteCommentCommand } from "@slice/engagement/commands";
import type { CommentRepository } from "@slice/engagement/repository";
import { TYPES } from "../like/create-like.handler.ts";
import { PrismaService } from "../../../../infrastructure/database/prisma.ts";

@injectable()
export class DeleteCommentCommandHandler implements CommandHandler<DeleteCommentCommand> {
  private readonly commentRepo: CommentRepository;
  private readonly eventBus: EventBus;
  private readonly prisma: PrismaService;

  constructor(
    @inject(TYPES.CommentRepository) commentRepo: CommentRepository,
    @inject(TYPES.EventBus) eventBus: EventBus,
    @inject(PrismaService) prisma: PrismaService
  ) {
    this.commentRepo = commentRepo;
    this.eventBus = eventBus;
    this.prisma = prisma;
  }

  async handle(command: DeleteCommentCommand): Promise<void> {
    const { commentID } = command.payload;

    const commentResult = await this.commentRepo.findById(commentID);
    if (!commentResult.ok) {
      throw commentResult.error;
    }

    const comment = commentResult.value;
    comment.delete();

    await this.commentRepo.delete(comment);

    for (const event of comment.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
