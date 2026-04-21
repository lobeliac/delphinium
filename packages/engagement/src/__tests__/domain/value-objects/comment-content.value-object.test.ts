import { describe, it, expect } from "vitest";
import { CommentContent } from "../../../domain/value-objects/index.ts";
import { ForbiddenWordError, CommentContentTooLongError } from "../../../error/index.ts";

describe("CommentContent", () => {
  it("should create valid comment content", () => {
    const result = CommentContent.create("This is a valid comment.");
    expect(result.ok).toBe(true);
    expect(result.value.value).toBe("This is a valid comment.");
  });

  it("should reject comment that is too long", () => {
    const longContent = "word ".repeat(101); // 101 words
    const result = CommentContent.create(longContent);
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(CommentContentTooLongError);
  });

  it("should reject comment with forbidden words", () => {
    const result = CommentContent.create("I love programming in java.");
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(ForbiddenWordError);
  });
});
