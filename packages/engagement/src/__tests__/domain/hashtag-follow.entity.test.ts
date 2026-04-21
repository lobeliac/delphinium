import { describe, it, expect } from "vitest";
import { HashtagVO } from "../../domain/value-objects/index.ts";
import { HashtagFollow } from "../../domain/hashtag-follow.entity.ts";
import { HashtagFollowedEvent } from "../../events/hashtag-followed.event.ts";
import { HashtagUnfollowedEvent } from "../../events/hashtag-unfollowed.event.ts";

describe("HashtagFollow Entity", () => {
  const newFollow = () => {
    return HashtagFollow.create({
      userID: "user-123",
      hashtag: HashtagVO.reconstitute("tech")
    });
  };

  it("should create a follow and emit HashtagFollowedEvent", () => {
    const follow = newFollow();

    expect(follow.userID).toBe("user-123");
    expect(follow.hashtag.value).toBe("tech");
    expect(follow.id).toBeDefined();

    const events = follow.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(HashtagFollowedEvent);

    const event = events[0] as HashtagFollowedEvent;
    expect(event.userID).toBe("user-123");
    expect(event.hashtag.value).toBe("tech");
  });

  it("should emit HashtagUnfollowedEvent when deleted", () => {
    const follow = newFollow();
    follow.delete();

    const events = follow.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1]).toBeInstanceOf(HashtagUnfollowedEvent);

    const event = events[1] as HashtagUnfollowedEvent;
    expect(event.followID).toBe(follow.id);
    expect(event.userID).toBe("user-123");
    expect(event.hashtag.value).toBe("tech");
  });
});
