import { EntityNotFoundError } from "@base/domain/error";
import type { ID } from "@base/domain/entity.base";

/**
 * Error thrown when a like cannot be found.
 */
export class LikeNotFoundError extends EntityNotFoundError {
  constructor(likeID: ID) {
    super("Like", likeID);
    this.name = "LikeNotFoundError";
  }
}
