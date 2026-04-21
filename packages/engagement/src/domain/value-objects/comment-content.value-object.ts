import { ValueObject } from "@base/domain/value-object.base";
import type { Result } from "@base/domain/result";
import { CommentContentTooLongError } from "../../error/comment-content-too-long.error.ts";
import { ForbiddenWordError } from "../../error/forbidden-word.error.ts";

/**
 * Value object representing the content of a comment.
 * Validates that the content is not too long (max 100 words) and does not contain forbidden words.
 */
export class CommentContent extends ValueObject<string> {
  private static readonly MAX_WORDS = 100;
  private static readonly FORBIDDEN_WORDS = ["java", "microsoft"];

  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a new instance of CommentContent.
   *
   * @param content The string content to validate.
   * @returns A Result containing the CommentContent if valid,
   *          or a CommentContentTooLongError / ForbiddenWordError if invalid.
   */
  public static create(
    content: string
  ): Result<CommentContent, CommentContentTooLongError | ForbiddenWordError> {
    if (content.split(" ").length > CommentContent.MAX_WORDS) {
      return {
        ok: false,
        error: new CommentContentTooLongError(CommentContent.MAX_WORDS)
      };
    }

    const lowerContent = content.toLowerCase();
    for (const word of CommentContent.FORBIDDEN_WORDS) {
      if (lowerContent.includes(word)) {
        return {
          ok: false,
          error: new ForbiddenWordError(word)
        };
      }
    }

    return { ok: true, value: new CommentContent(content) };
  }

  /**
   * Reconstitutes a CommentContent instance without validation.
   *
   * @param content The string content.
   * @returns A new instance of CommentContent.
   */
  public static reconstitute(content: string): CommentContent {
    return new CommentContent(content);
  }
}
