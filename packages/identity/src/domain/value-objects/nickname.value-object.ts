import { ValueObject } from "@base/domain/value-object.base";
import type { Result } from "@base/domain/result";
import { InvalidNicknameError } from "../../error/invalid-nickname.error.ts";

/**
 * Represents a user's unique nickname.
 * Enforces length and alphanumeric slug constraints.
 */
export class Nickname extends ValueObject<string> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 16;
  private static readonly SLUG_REGEXP = /^[a-z0-9]+$/;

  private constructor(value: string) {
    super(value);
  }

  /**
   * Validates and creates a new Nickname instance.
   * @returns A Result containing the Nickname or an InvalidNicknameError.
   */
  public static create(raw: string): Result<Nickname, InvalidNicknameError> {
    if (raw.length < Nickname.MIN_LENGTH) {
      return {
        ok: false,
        error: new InvalidNicknameError(
          `Nickname must not be less than ${Nickname.MIN_LENGTH} characters.`
        )
      };
    }

    if (raw.length > Nickname.MAX_LENGTH) {
      return {
        ok: false,
        error: new InvalidNicknameError(
          `Nickname must not be longer than ${Nickname.MAX_LENGTH} characters.`
        )
      };
    }

    if (!Nickname.SLUG_REGEXP.test(raw)) {
      return {
        ok: false,
        error: new InvalidNicknameError(
          "Nickname must contain only lowercase letters, numbers and dashes."
        )
      };
    }

    return { ok: true, value: new Nickname(raw) };
  }

  /**
   * Bypasses validation to create a Nickname instance from persisted data.
   */
  public static reconstitute(nickname: string): Nickname {
    return new Nickname(nickname);
  }
}
