import { ValueObject } from "@base/domain/value-object.base";
import type { Result } from "@base/domain/result";
import { WeakPasswordError } from "../../error/weak-password.error.ts";
/**
 * Represents a secure user password.
 * Enforces complexity requirements: length, casing, numbers, and special characters.
 */
export class Password extends ValueObject<string> {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 32;

  private static readonly UPPERCASE_REGEXP = /[A-Z]/;
  private static readonly LOWERCASE_REGEXP = /[a-z]/;
  private static readonly NUMBER_REGEXP = /\d/;
  private static readonly NONALPHA_REGEXP = /\W/;

  private constructor(value: string) {
    super(value);
  }

  /**
   * Validates and creates a new Password instance.
   * @returns A Result containing the Password or a WeakPasswordError.
   */
  public static create(raw: string): Result<Password, WeakPasswordError> {
    if (raw.length < Password.MIN_LENGTH) {
      return {
        ok: false,
        error: new WeakPasswordError(
          `Password must be at least ${Password.MIN_LENGTH} characters long.`
        )
      };
    }

    if (raw.length > Password.MAX_LENGTH) {
      return {
        ok: false,
        error: new WeakPasswordError(
          `Password must not be longer than ${Password.MAX_LENGTH} characters long.`
        )
      };
    }

    if (!Password.UPPERCASE_REGEXP.test(raw)) {
      return {
        ok: false,
        error: new WeakPasswordError("Password must contain at least one capital letter.")
      };
    }

    if (!Password.LOWERCASE_REGEXP.test(raw)) {
      return {
        ok: false,
        error: new WeakPasswordError("Password must contain at least one small letter.")
      };
    }

    if (!Password.NUMBER_REGEXP.test(raw)) {
      return {
        ok: false,
        error: new WeakPasswordError("Password must contain at least one number.")
      };
    }

    if (!Password.NONALPHA_REGEXP.test(raw)) {
      return {
        ok: false,
        error: new WeakPasswordError("Password must contain at least one special character.")
      };
    }

    if (raw.trim() !== raw) {
      return {
        ok: false,
        error: new WeakPasswordError("Password must not contain any spaces.")
      };
    }

    return { ok: true, value: new Password(raw) };
  }

  /**
   * Bypasses validation to create a Password instance from persisted data.
   */
  public static reconstitute(password: string): Password {
    return new Password(password);
  }
}
