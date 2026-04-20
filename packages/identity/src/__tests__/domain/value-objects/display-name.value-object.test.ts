import { describe, it, expect } from "vitest";
import { DisplayName } from "../../../domain/value-objects/displayname.value-object.ts";
import { InvalidDisplayNameError } from "../../../error/invalid-displayname.error.ts";

describe("DisplayName", () => {
  it("should create a valid display name", () => {
    const result = DisplayName.create("Valid Display Name");
    expect(result.ok).toBe(true);
    expect(result.value.value).toBe("Valid Display Name");
  });

  it("should reject short display names", () => {
    const result = DisplayName.create("A");
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(InvalidDisplayNameError);
  });

  it("should reject long display names", () => {
    const result = DisplayName.create("a".repeat(51));
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(InvalidDisplayNameError);
  });

  describe("reconstitute", () => {
    it("should bypass validation", () => {
      const rawValue = "12";
      const result = DisplayName.reconstitute(rawValue);
      expect(result.value).toBe(rawValue);
    });
  });
});
