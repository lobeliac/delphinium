import { describe, it, expect } from "vitest";
import { HashtagVO } from "../../domain/value-objects/index.ts";
import { MiniblogHashtag } from "../../domain/miniblog-hashtag.entity.ts";
import { MiniblogTaggedEvent } from "../../events/miniblog-tagged.event.ts";
import { MiniblogUntaggedEvent } from "../../events/miniblog-untagged.event.ts";

describe("MiniblogHashtag Entity", () => {
  const newTag = () => {
    return MiniblogHashtag.create({
      miniblogID: "blog-123",
      hashtag: HashtagVO.reconstitute("tech")
    });
  };

  it("should create a tag and emit MiniblogTaggedEvent", () => {
    const tag = newTag();

    expect(tag.miniblogID).toBe("blog-123");
    expect(tag.hashtag.value).toBe("tech");
    expect(tag.id).toBeDefined();

    const events = tag.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(MiniblogTaggedEvent);

    const event = events[0] as MiniblogTaggedEvent;
    expect(event.miniblogID).toBe("blog-123");
    expect(event.hashtag.value).toBe("tech");
  });

  it("should emit MiniblogUntaggedEvent when deleted", () => {
    const tag = newTag();
    tag.delete();

    const events = tag.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1]).toBeInstanceOf(MiniblogUntaggedEvent);

    const event = events[1] as MiniblogUntaggedEvent;
    expect(event.tagID).toBe(tag.id);
    expect(event.miniblogID).toBe("blog-123");
    expect(event.hashtag.value).toBe("tech");
  });
});
