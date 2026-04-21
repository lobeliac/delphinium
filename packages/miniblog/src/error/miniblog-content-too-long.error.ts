import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when the miniblog content exceeds the maximum allowed length.
 */
export class MiniblogContentTooLongError extends InvariantViolationError {
  /**
   * @param max The maximum number of words allowed.
   */
  constructor(max: number) {
    super(`Miniblog content exceeds the maximum limit of ${max} words.`);
    this.name = "MiniblogContentTooLongError";
  }
}
