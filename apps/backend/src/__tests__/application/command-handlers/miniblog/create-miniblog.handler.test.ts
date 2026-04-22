import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateMiniblogCommandHandler } from "../../../../application/command-handlers/miniblog/create-miniblog.handler.ts";
import { CreateMiniblogCommand } from "@slice/miniblog/commands";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import type { EventBus } from "@base/domain/event";
import {
  MiniblogContent,
  MiniblogVisibilityVO,
  MiniblogVisibilityEnum
} from "@slice/miniblog/domain";
import { MiniblogCreatedEvent } from "@slice/miniblog/events";

describe("CreateMiniblogCommandHandler", () => {
  let handler: CreateMiniblogCommandHandler;
  let mockMiniblogRepo: MiniblogRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockMiniblogRepo = {
      findById: vi.fn(),
      findAllByAuthor: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as MiniblogRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as EventBus;

    handler = new CreateMiniblogCommandHandler(mockMiniblogRepo, mockEventBus);
  });

  it("should create a miniblog, save it, and publish an event", async () => {
    // Setup
    const contentResult = MiniblogContent.create("Hello world!");
    expect(contentResult.ok).toBe(true);

    const command = new CreateMiniblogCommand({
      authorId: "author-123",
      content: contentResult.value
      // No visibility provided, should default to PUBLIC
    });

    // Execute
    await handler.handle(command);

    // Verify
    expect(mockMiniblogRepo.save).toHaveBeenCalledTimes(1);

    // Check what was passed to save
    const savedMiniblog = vi.mocked(mockMiniblogRepo.save).mock.calls[0][0];
    expect(savedMiniblog.authorID).toBe("author-123");
    expect(savedMiniblog.content.value).toBe("Hello world!");
    expect(savedMiniblog.visibility.value).toBe(MiniblogVisibilityEnum.PUBLIC);

    // Verify event was published
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    const publishedEvent = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(MiniblogCreatedEvent);
  });

  it("should create a miniblog with a specific visibility if provided", async () => {
    // Setup
    const contentResult = MiniblogContent.reconstitute("Secret content");
    const visibility = MiniblogVisibilityVO.create(MiniblogVisibilityEnum.PRIVATE);

    const command = new CreateMiniblogCommand({
      authorId: "author-123",
      content: contentResult,
      visibility
    });

    // Execute
    await handler.handle(command);

    // Verify
    const savedMiniblog = vi.mocked(mockMiniblogRepo.save).mock.calls[0][0];
    expect(savedMiniblog.visibility.value).toBe(MiniblogVisibilityEnum.PRIVATE);
  });
});
