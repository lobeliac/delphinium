import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateCommentCommandHandler } from "../../../../../application/command-handlers/engagement/comment/create-comment.handler.ts";
import { CreateCommentCommand } from "@slice/engagement/commands";
import type { CommentRepository } from "@slice/engagement/repository";
import type { EventBus } from "@base/domain/event";
import { CommentCreatedEvent } from "@slice/engagement/events";

describe("CreateCommentCommandHandler", () => {
  let handler: CreateCommentCommandHandler;
  let mockCommentRepo: CommentRepository;
  let mockEventBus: EventBus;

  beforeEach(() => {
    mockCommentRepo = {
      findById: vi.fn(),
      findByBlog: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as CommentRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as EventBus;

    handler = new CreateCommentCommandHandler(mockCommentRepo, mockEventBus);
  });

  it("should create a comment, save it, and publish an event", async () => {
    const command = new CreateCommentCommand({
      userID: "user-123",
      miniblogID: "miniblog-123",
      content: "This is a comment!"
    });

    await handler.handle(command);

    expect(mockCommentRepo.save).toHaveBeenCalledTimes(1);
    const savedComment = vi.mocked(mockCommentRepo.save).mock.calls[0][0];
    expect(savedComment.userID).toBe("user-123");
    expect(savedComment.miniblogID).toBe("miniblog-123");
    expect(savedComment.content.value).toBe("This is a comment!");

    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
    const publishedEvent = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(CommentCreatedEvent);
  });
});
