import { describe, it, expect } from "vitest";
import { HashtagVO } from "../../../domain/value-objects/index.ts";
import { InvalidHashtagFormatError } from "../../../error/index.ts";

describe("HashtagVO", () => {
  it("should create valid hashtags", () => {
    const result = HashtagVO.create("Tech");
    expect(result.ok).toBe(true);
    expect(result.value.value).toBe("tech");
  });

  it("should reject invalid hashtag formats", () => {
    const invalidTags = [
      "invalid tag",
      "no-symbols!",
      "waytoolonghashtagthatisoverthirtycharacters"
    ];
    for (const tag of invalidTags) {
      const result = HashtagVO.create(tag);
      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(InvalidHashtagFormatError);
    }
  });
});
