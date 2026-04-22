import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FollowHashtagCommandHandler } from "../../../../../application/command-handlers/engagement/hashtag/follow-hashtag.handler.ts";
import { FollowHashtagCommand } from "@slice/engagement/commands";
import type { HashtagFollowRepository } from "@slice/engagement/repository";
import type { EventBus } from "@base/domain/event";
import { HashtagFollowedEvent } from "@slice/engagement/events";

describe("FollowHashtagCommandHandler", () => {
  let handler: FollowHashtagCommandHandler;
  let mockHashtagFollowRepo: HashtagFollowRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockHashtagFollowRepo = {
      findById: vi.fn(),
      findByUser: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as unknown as HashtagFollowRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as EventBus;

    handler = new FollowHashtagCommandHandler(mockHashtagFollowRepo, mockEventBus);
  });

  it("should create a hashtag follow, save it, and publish an event", async () => {
    const command = new FollowHashtagCommand({
      userID: "user-123",
      hashtag: "programming"
    });

    await handler.handle(command);

    expect(mockHashtagFollowRepo.save).toHaveBeenCalledTimes(1);
    const savedFollow = vi.mocked(mockHashtagFollowRepo.save).mock.calls[0][0];
    expect(savedFollow.userID).toBe("user-123");
    expect(savedFollow.hashtag.value).toBe("programming");

    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    const publishedEvent = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(HashtagFollowedEvent);
  });
});
