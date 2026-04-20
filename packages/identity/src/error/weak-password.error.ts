import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when a password does not meet the required complexity or length standards.
 */
export class WeakPasswordError extends InvariantViolationError {
  constructor(message: string) {
    super(message);
    this.name = "WeakPasswordError";
  }
}
