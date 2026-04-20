import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when a DisplayName fails validation rules.
 */
export class InvalidDisplayNameError extends InvariantViolationError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDisplayNameError";
  }
}
