import { describe, it, expect } from "vitest";
import { Nickname } from "../../../domain/value-objects/nickname.value-object.ts";

describe("Nickname Value Object", () => {
  describe("create", () => {
    it("should create a valid nickname", () => {
      const result = Nickname.create("user123");
      expect(result.ok).toBe(true);
    });

    it("should fail if the result is false", () => {
      const result = Nickname.create("!!!");
      expect(result.ok).toBe(false);
    });

    it("should fail if nickname length exceeds 16 characters", () => {
      const result = Nickname.create("verylongnicknamethatisover16");
      expect(result.ok).toBe(false);
    });

    it("should fail if nickname length less than 3 characters", () => {
      const result = Nickname.create("12");
      expect(result.ok).toBe(false);
    });
  });

  describe("reconstitute", () => {
    it("should bypass validation", () => {
      const rawValue = "User_Name!";
      const result = Nickname.reconstitute(rawValue);
      expect(result.value).toBe(rawValue);
    });
  });
});
