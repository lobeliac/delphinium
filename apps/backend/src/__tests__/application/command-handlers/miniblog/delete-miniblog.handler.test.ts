import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteMiniblogCommandHandler } from "../../../../application/command-handlers/miniblog/delete-miniblog.handler.ts";
import { DeleteMiniblogCommand } from "@slice/miniblog/commands";
import {
  Miniblog,
  MiniblogContent,
  MiniblogVisibilityVO,
  MiniblogVisibilityEnum
} from "@slice/miniblog/domain";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import type { EventBus } from "@base/domain/event";
import { MiniblogDeletedEvent } from "@slice/miniblog/events";
import type { PrismaService } from "../../../../infrastructure/database/prisma.ts";

describe("DeleteMiniblogCommandHandler", () => {
  let handler: DeleteMiniblogCommandHandler;
  let mockMiniblogRepo: MiniblogRepository;
  let mockEventBus: EventBus;
  let mockPrisma: PrismaService;
  let existingMiniblog: Miniblog;

  beforeEach(() => {
    const contentResult = MiniblogContent.reconstitute("Old content");

    existingMiniblog = Miniblog.reconstitute(
      {
        authorID: "author-123",
        content: contentResult,
        visibility: MiniblogVisibilityVO.create(MiniblogVisibilityEnum.PUBLIC),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      "miniblog-123"
    );

    mockMiniblogRepo = {
      findById: vi.fn().mockResolvedValue({ ok: true, value: existingMiniblog }),
      findAllByAuthor: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as MiniblogRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as EventBus;

    mockPrisma = {
      miniblog: {
        delete: vi.fn()
      }
    } as unknown as PrismaService;

    handler = new DeleteMiniblogCommandHandler(mockMiniblogRepo, mockEventBus, mockPrisma);
  });

  it("should delete the miniblog and publish a delete event", async () => {
    const command = new DeleteMiniblogCommand({
      miniblogId: "miniblog-123"
    });

    await handler.handle(command);

    expect(mockPrisma.miniblog.delete).toHaveBeenCalledWith({ where: { id: "miniblog-123" } });

    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    const publishedEvent = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(MiniblogDeletedEvent);
  });
});
