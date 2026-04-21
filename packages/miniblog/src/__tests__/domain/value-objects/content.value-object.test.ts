import { describe, it, expect } from "vitest";
import { MiniblogContent } from "../../../domain/value-objects/index.ts";
import { ForbiddenWordError, MiniblogContentTooLongError } from "../../../error/index.ts";

describe("MiniblogContent", () => {
  it("should create valid miniblog content", () => {
    const content = MiniblogContent.create("Valid content");
    expect(content.ok).toBe(true);
    expect(content.value.value).toBe("Valid content");
  });

  it("should reject content that is too long", () => {
    const longContent = "A ".repeat(101); // 101 words
    const content = MiniblogContent.create(longContent);
    expect(content.ok).toBe(false);
    expect(content.error).toBeInstanceOf(MiniblogContentTooLongError);
  });

  it("should reject content with forbidden words", () => {
    const content = MiniblogContent.create("This content contains java");
    expect(content.ok).toBe(false);
    expect(content.error).toBeInstanceOf(ForbiddenWordError);
  });
});
