import { ValueObject } from "@base/domain/value-object.base";
import type { Result } from "@base/domain/result";
import { InvariantViolationError } from "@base/domain/error";

/**
 * Represents a user's biography.
 * Enforces a maximum character length.
 */
export class Bio extends ValueObject<string> {
  private static readonly MAX_LENGTH = 100;

  private constructor(value: string) {
    super(value);
  }

  /**
   * Validates and creates a new Bio instance.
   * @returns A Result containing the Bio or an InvariantViolationError.
   */
  public static create(bio: string): Result<Bio, InvariantViolationError> {
    if (bio.length > Bio.MAX_LENGTH) {
      return {
        ok: false,
        error: new InvariantViolationError(
          `Bio must not be longer than ${Bio.MAX_LENGTH} characters.`
        )
      };
    }

    return { ok: true, value: new Bio(bio) };
  }

  /**
   * Bypasses validation to create a Bio instance from persisted data.
   */
  public static reconstitute(bio: string): Bio {
    return new Bio(bio);
  }
}
