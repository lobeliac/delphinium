import { describe, it, expect } from "vitest";
import {
  MiniblogContent,
  MiniblogVisibilityEnum,
  MiniblogVisibilityVO
} from "../../domain/value-objects/index.js";
import { Miniblog } from "../../domain/miniblog.entity.js";
import type { MiniblogUpdatedEvent } from "../../events/index.ts";
import { MiniblogCreatedEvent } from "../../events/index.ts";

describe("Miniblog", () => {
  const miniBlogCreate = () => {
    return Miniblog.create({
      authorID: "author-123",
      content: MiniblogContent.reconstitute("This is a valid miniblog post!"),
      visibility: MiniblogVisibilityVO.create(MiniblogVisibilityEnum.PUBLIC)
    });
  };
  describe("when creating a miniblog", () => {
    it("should create a miniblog with valid content", () => {
      const miniblog = miniBlogCreate();
      expect(miniblog.id).toBeDefined();
      expect(miniblog.authorID).toBe("author-123");
      expect(miniblog.content.value).toBe("This is a valid miniblog post!");
      expect(miniblog.visibility.value).toBe(MiniblogVisibilityEnum.PUBLIC);

      const events = miniblog.getAndClearEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(MiniblogCreatedEvent);
    });
  });

  describe("updateContent", () => {
    it("should update the content of a miniblog", () => {
      const miniblog = miniBlogCreate();
      miniblog.updateBlogContent(MiniblogContent.reconstitute("Updated content"));
      expect(miniblog.content.value).toBe("Updated content");

      const events = miniblog.getAndClearEvents;
      expect(events).toHaveLength(2);
      const updatedEvent = events[1];
      expect(updatedEvent.constructor.name).toBe("MiniblogUpdatedEvent");
      expect((updatedEvent as MiniblogUpdatedEvent).content).toBe(miniblog.content);
    });
  });
  describe("updateVisibility", () => {
    it("should update the visibility of a miniblog", () => {
      const miniblog = miniBlogCreate();
      miniblog.updateVisibility(MiniblogVisibilityVO.create(MiniblogVisibilityEnum.PRIVATE));
      expect(miniblog.visibility.value).toBe(MiniblogVisibilityEnum.PRIVATE);

      const events = miniblog.getAndClearEvents;
      expect(events).toHaveLength(2);
      const updatedEvent = events[1];
      expect(updatedEvent.constructor.name).toBe("MiniblogUpdatedEvent");
      expect((updatedEvent as MiniblogUpdatedEvent).visibility).toBe(miniblog.visibility);
    });
  });
});
