import { describe, it, expect } from "vitest";
import { Like } from "../../domain/like.entity.ts";
import { LikeCreatedEvent } from "../../events/like-created.event.ts";
import { LikeRemovedEvent } from "../../events/like-removed.event.ts";

describe("Like Entity", () => {
  const newLike = () => Like.create({ userID: "user-123", miniblogID: "blog-456" });

  it("Like create", () => {
    const like = newLike();

    expect(like.userID).toBe("user-123");
    expect(like.miniblogID).toBe("blog-456");
    expect(like.id).toBeDefined();

    const events = like.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(LikeCreatedEvent);

    const event = events[0] as LikeCreatedEvent;
    expect(event.userID).toBe("user-123");
    expect(event.miniblogID).toBe("blog-456");
  });

  it("Like remove", () => {
    const like = newLike();

    like.delete();

    const events = like.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1]).toBeInstanceOf(LikeRemovedEvent);

    const event = events[1] as LikeRemovedEvent;
    expect(event.likeID).toBe(like.id);
    expect(event.userID).toBe("user-123");
    expect(event.miniblogID).toBe("blog-456");
  });
});
