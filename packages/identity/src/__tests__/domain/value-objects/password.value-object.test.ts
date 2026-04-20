import { describe, it, expect } from "vitest";
import { Password } from "../../../domain/value-objects/password.value-object.ts";
import { WeakPasswordError } from "../../../error/weak-password.error.ts";

describe("Password Value Object", () => {
  const assertError = (result: any, expectedMessage: string) => {
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(WeakPasswordError);
    expect(result.error.message).toBe(expectedMessage);
  };
  describe("create", () => {
    it("should create a valid password with all required complexity", () => {
      const result = Password.create("Abc12345!");
      expect(result.ok).toBe(true);
      expect(result.value.value).toBe("Abc12345!");
    });

    it("should fail with specific error if password is too short", () => {
      const result = Password.create("Ab1!");
      assertError(result, "Invalid argument: Password must be at least 8 characters long.");
    });

    it("should fail with specific error if password is too long", () => {
      const result = Password.create("Ab1!".repeat(25));
      assertError(result, "Invalid argument: Password must not be longer than 32 characters long.");
    });

    it("should fail with specific error if missing an uppercase letter", () => {
      const result = Password.create("abc12345!");
      assertError(result, "Invalid argument: Password must contain at least one capital letter.");
    });

    it("should fail with specific error if missing a lowercase letter", () => {
      const result = Password.create("ABC12345!");
      assertError(result, "Invalid argument: Password must contain at least one small letter.");
    });

    it("should fail with specific error if missing a number", () => {
      const result = Password.create("Abcdefgh!");
      assertError(result, "Invalid argument: Password must contain at least one number.");
    });

    it("should fail with specific error if missing a special character", () => {
      const result = Password.create("Abc123456");
      assertError(
        result,
        "Invalid argument: Password must contain at least one special character."
      );
    });

    it("should fail if password contains whitespace", () => {
      const result = Password.create("     Da1!   ");
      assertError(result, "Invalid argument: Password must not contain any spaces.");
    });

    it("should NOT change the casing or characters", () => {
      const complex = "  Abc!123321  ";
      const result = Password.create(complex.trim());
      expect(result.ok).toBe(true);
      expect(result.value.value).toBe("Abc!123321");
    });
  });

  describe("reconstitute", () => {
    it("should bypass all complexity validations", () => {
      const weakPassword = "123";
      const result = Password.reconstitute(weakPassword);
      expect(result.value).toBe(weakPassword);
    });
  });
});
