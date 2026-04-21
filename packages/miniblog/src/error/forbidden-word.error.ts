import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when the content contains a forbidden word.
 */
export class ForbiddenWordError extends InvariantViolationError {
  /**
   * @param word The forbidden word that was found.
   */
  constructor(word: string) {
    super(`Content contains a forbidden word called ${word} .`);
    this.name = "ForbiddenWordError";
  }
}
