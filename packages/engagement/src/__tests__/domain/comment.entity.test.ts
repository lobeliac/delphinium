import { describe, it, expect } from "vitest";
import { Comment } from "../../domain/comment.entity.ts";
import { CommentContent } from "../../domain/value-objects/index.ts";
import { CommentCreatedEvent } from "../../events/comment-created.event.ts";
import { CommentUpdatedEvent } from "../../events/comment-updated.event.ts";
import { CommentDeletedEvent } from "../../events/comment-deleted.event.ts";

describe("Comment Entity", () => {
  const newComment = () =>
    Comment.create({
      userID: "user-123",
      miniblogID: "blog-456",
      content: CommentContent.reconstitute("Great blog!")
    });

  it("should create a Comment", () => {
    const comment = newComment();

    expect(comment.userID).toBe("user-123");
    expect(comment.miniblogID).toBe("blog-456");
    expect(comment.content.value).toBe("Great blog!");

    const events = comment.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(CommentCreatedEvent);

    const event = events[0] as CommentCreatedEvent;
    expect(event.userID).toBe("user-123");
    expect(event.content.value).toBe("Great blog!");
  });

  it("updateContent", () => {
    const comment = newComment();

    comment.updateContent(CommentContent.reconstitute("Updated comment."));

    expect(comment.content.value).toBe("Updated comment.");

    const events = comment.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1]).toBeInstanceOf(CommentUpdatedEvent);

    const event = events[1] as CommentUpdatedEvent;
    expect(event.content.value).toBe("Updated comment.");
  });

  it("delete", () => {
    const comment = newComment();

    comment.delete();

    const events = comment.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1]).toBeInstanceOf(CommentDeletedEvent);

    const event = events[1] as CommentDeletedEvent;
    expect(event.commentID).toBe(comment.id);
  });
});
