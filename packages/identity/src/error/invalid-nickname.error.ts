import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when a Nickname fails validation (e.g., length or character constraints).
 */
export class InvalidNicknameError extends InvariantViolationError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidNicknameError";
  }
}
