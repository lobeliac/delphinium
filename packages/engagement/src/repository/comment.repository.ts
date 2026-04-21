import type { Repository } from "@base/domain/repository.base";
import type { ID } from "@base/domain/entity.base";
import type { Comment } from "../domain/comment.entity.ts";

export type CommentRepository = {
  /**
   * Retrieves all comments for a specific miniblog.
   * @param miniblogID - The unique identifier of the miniblog.
   */
  findByBlog(miniblogID: ID): Promise<Comment[]>;
} & Repository<Comment>;
