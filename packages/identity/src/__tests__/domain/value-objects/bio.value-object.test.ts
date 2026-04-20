import { describe, it, expect } from "vitest";
import { Bio } from "../../../domain/value-objects/bio.value-object.ts";
import { InvariantViolationError } from "@base/domain/error";

describe("Bio Value Object", () => {
  describe("create", () => {
    it("should create a Bio instance when the string is within length limits", () => {
      const validBio = "Hello, I am a developer!";
      const result = Bio.create(validBio);

      expect(result.ok).toBe(true);
      expect(result.value.value).toBe(validBio);
    });

    it("should return an error if the string exceeds MAX_LENGTH", () => {
      const invalidBio = "a".repeat(101);
      const result = Bio.create(invalidBio);

      expect(result.ok).toBe(false);
      expect(result.error).toBeInstanceOf(InvariantViolationError);
    });

    it("should allow a bio exactly at the MAX_LENGTH", () => {
      const boundaryBio = "a".repeat(100);
      const result = Bio.create(boundaryBio);

      expect(result.ok).toBe(true);
      expect(result.value.value).toBe(boundaryBio);
    });
  });

  describe("reconstitute", () => {
    it("should create a Bio instance without validation", () => {
      const existingBio = "Existing bio from DB";
      const bio = Bio.reconstitute(existingBio);

      expect(bio.value).toBe(existingBio);
    });
  });
});
