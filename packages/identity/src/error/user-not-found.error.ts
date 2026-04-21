import { EntityNotFoundError } from "@base/domain/error";
import type { ID } from "@base/domain/entity.base";

/**
 * Error thrown when a user cannot be found.
 */
export class UserNotFoundError extends EntityNotFoundError {
  constructor(userID: ID) {
    super("User", userID);
    this.name = "UserNotFoundError";
  }
}
