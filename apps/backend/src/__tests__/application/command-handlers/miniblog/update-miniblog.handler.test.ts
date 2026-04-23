import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateMiniblogCommandHandler } from "../../../../application/command-handlers/miniblog/update-miniblog.handler.ts";
import { UpdateMiniblogCommand } from "@slice/miniblog/commands";
import {
  Miniblog,
  MiniblogContent,
  MiniblogVisibilityVO,
  MiniblogVisibilityEnum
} from "@slice/miniblog/domain";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import type { EventBus } from "@base/domain/event";
import { MiniblogUpdatedEvent } from "@slice/miniblog/events";

describe("UpdateMiniblogCommandHandler", () => {
  let handler: UpdateMiniblogCommandHandler;
  let mockMiniblogRepo: MiniblogRepository;
  let mockEventBus: EventBus;
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
      findAll: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as MiniblogRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as EventBus;

    handler = new UpdateMiniblogCommandHandler(mockMiniblogRepo, mockEventBus);
  });

  it("should update content and save, publishing an event", async () => {
    const newContentResult = MiniblogContent.reconstitute("New content");

    const command = new UpdateMiniblogCommand({
      miniblogId: "miniblog-123",
      content: newContentResult
    });

    await handler.handle(command);

    expect(mockMiniblogRepo.save).toHaveBeenCalledWith(existingMiniblog);
    expect(existingMiniblog.content.value).toBe("New content");

    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    const publishedEvent = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(MiniblogUpdatedEvent);
  });
});
