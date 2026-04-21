import { InvariantViolationError } from "@base/domain/error";

/**
 * Error thrown when a hashtag has an invalid format.
 */
export class InvalidHashtagFormatError extends InvariantViolationError {
  constructor(hashtag: string) {
    super(
      `The hashtag '${hashtag}' is invalid. Hashtags must be alphanumeric, no spaces, and max 30 characters.`
    );
    this.name = "InvalidHashtagFormatError";
  }
}
