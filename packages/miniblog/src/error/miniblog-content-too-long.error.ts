import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when the miniblog content exceeds the maximum allowed length.
 */
export class MiniblogContentTooLongError extends InvariantViolationError {
  /**
   * @param max The maximum number of words allowed.
   */
  constructor(max: number) {
    super(`Blog can't be longer than the maximum ${max} number of words long`);
    this.name = "MiniblogContentTooLongError";
  }
}
