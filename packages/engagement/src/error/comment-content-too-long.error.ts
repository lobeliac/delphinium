import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when the comment content exceeds the maximum allowed length.
 */
export class CommentContentTooLongError extends InvariantViolationError {
  /**
   * @param max The maximum number of words allowed.
   */
  constructor(max: number) {
    super(`Comment content exceeds the maximum limit of ${max} words.`);
    this.name = "CommentContentTooLongError";
  }
}
