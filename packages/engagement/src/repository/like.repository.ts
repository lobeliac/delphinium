import type { Repository } from "@base/domain/repository.base";
import type { ID } from "@base/domain/entity.base";
import type { Like } from "../domain/like.entity.ts";

export type LikeRepository = {
  /**
   * Retrieves all likes made by a specific user.
   * @param userID - The unique identifier of the user.
   */
  findByUser(userID: ID): Promise<Like[]>;

  /**
   * Retrieves all likes for a specific miniblog.
   * @param miniblogID - The unique identifier of the miniblog.
   */
  findByBlog(miniblogID: ID): Promise<Like[]>;

  /**
   * Deletes a like by user and miniblog ID.
   * Note: This is a convenience method over the base `delete(entity)`
   * @param userID - The unique identifier of the user.
   * @param miniblogID - The unique identifier of the miniblog.
   */
  deleteByUserAndBlog(userID: ID, miniblogID: ID): Promise<void>;
} & Repository<Like>;
