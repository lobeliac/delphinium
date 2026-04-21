import { ValueObject } from "@base/domain/value-object.base";
import type { Result } from "@base/domain/result";
import { MiniblogContentTooLongError } from "../../error/miniblog-content-too-long.error.ts";
import { ForbiddenWordError } from "../../error/forbidden-word.error.ts";

/**
 * Value object representing the content of a miniblog.
 * Validates that the content is not too long and does not contain forbidden words.
 */
export class MiniblogContent extends ValueObject<string> {
  private static readonly MAX_WORDS = 100;
  private static readonly FORBIDDEN_WORDS = ["java", "microsoft"];

  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a new instance of MiniblogContent.
   *
   * @param content The string content to validate.
   * @returns A Result containing the MiniblogContent if valid,
   *          or a MiniblogContentTooLongError / ForbiddenWordError if invalid.
   */
  public static create(
    content: string
  ): Result<MiniblogContent, MiniblogContentTooLongError | ForbiddenWordError> {
    if (content.split(" ").length > MiniblogContent.MAX_WORDS) {
      return {
        ok: false,
        error: new MiniblogContentTooLongError(MiniblogContent.MAX_WORDS)
      };
    }

    const lowerContent = content.toLowerCase();
    for (const word of MiniblogContent.FORBIDDEN_WORDS) {
      if (lowerContent.includes(word)) {
        return {
          ok: false,
          error: new ForbiddenWordError(word)
        };
      }
    }

    return { ok: true, value: new MiniblogContent(content) };
  }

  /**
   * Reconstitutes a MiniblogContent instance without validation.
   *
   * @param content The string content.
   * @returns A new instance of MiniblogContent.
   */
  public static reconstitute(content: string): MiniblogContent {
    return new MiniblogContent(content);
  }
}
