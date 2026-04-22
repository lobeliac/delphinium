import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateLikeCommandHandler } from "../../../../../application/command-handlers/engagement/like/create-like.handler.ts";
import { CreateLikeCommand } from "@slice/engagement/commands";
import type { LikeRepository } from "@slice/engagement/repository";
import type { EventBus } from "@base/domain/event";
import { LikeCreatedEvent } from "@slice/engagement/events";

describe("CreateLikeCommandHandler", () => {
  let handler: CreateLikeCommandHandler;
  let mockLikeRepo: LikeRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockLikeRepo = {
      findById: vi.fn(),
      findByBlog: vi.fn(),
      findByUser: vi.fn(),
      findByUserAndBlog: vi.fn(),
      deleteByUserAndBlog: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as unknown as LikeRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as unknown as EventBus;

    handler = new CreateLikeCommandHandler(mockLikeRepo, mockEventBus);
  });

  it("should create a like, save it, and publish an event", async () => {
    const command = new CreateLikeCommand({
      userID: "user-123",
      miniblogID: "miniblog-123"
    });

    await handler.handle(command);

    expect(mockLikeRepo.save).toHaveBeenCalledTimes(1);
    const savedLike = vi.mocked(mockLikeRepo.save).mock.calls[0][0];
    expect(savedLike.userID).toBe("user-123");
    expect(savedLike.miniblogID).toBe("miniblog-123");

    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    const publishedEvent = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(LikeCreatedEvent);
  });
});
