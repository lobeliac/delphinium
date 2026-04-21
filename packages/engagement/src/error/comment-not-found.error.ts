import { EntityNotFoundError } from "@base/domain/error";
import type { ID } from "@base/domain/entity.base";

/**
 * Error thrown when a comment cannot be found.
 */
export class CommentNotFoundError extends EntityNotFoundError {
  constructor(commentID: ID) {
    super("Comment", commentID);
    this.name = "CommentNotFoundError";
  }
}
