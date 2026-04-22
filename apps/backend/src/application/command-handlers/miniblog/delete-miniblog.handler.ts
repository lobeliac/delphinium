import { injectable, inject } from "inversify";
import type { CommandHandler } from "@base/domain/command-handler";
import type { EventBus } from "@base/domain/event";
import type { DeleteMiniblogCommand } from "@slice/miniblog/commands";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import { TYPES } from "./create-miniblog.handler.ts";
import { PrismaService } from "../../../infrastructure/database/prisma.ts";

@injectable()
export class DeleteMiniblogCommandHandler implements CommandHandler<DeleteMiniblogCommand> {
  private readonly miniblogRepo: MiniblogRepository;
  private readonly eventBus: EventBus;
  private readonly prisma: PrismaService;

  constructor(
    @inject(TYPES.MiniblogRepository) miniblogRepo: MiniblogRepository,
    @inject(TYPES.EventBus) eventBus: EventBus,
    @inject(PrismaService) prisma: PrismaService
  ) {
    this.miniblogRepo = miniblogRepo;
    this.eventBus = eventBus;
    this.prisma = prisma;
  }

  async handle(command: DeleteMiniblogCommand): Promise<void> {
    const { miniblogId } = command.payload;

    const miniblogResult = await this.miniblogRepo.findById(miniblogId);
    if (!miniblogResult.ok) {
      throw miniblogResult.error;
    }

    const miniblog = miniblogResult.value;

    // 1. Fire domain logic (raises domain event)
    miniblog.delete();

    // 2. We actually delete from DB.
    // The repository pattern in Prisma for actual deletion can be direct delete.
    await this.prisma.miniblog.delete({
      where: { id: miniblogId }
    });

    // 3. Publish event
    for (const event of miniblog.getAndClearEvents) {
      await this.eventBus.publish(event);
    }
  }
}
