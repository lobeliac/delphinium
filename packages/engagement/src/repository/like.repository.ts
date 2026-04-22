import type { Repository } from "@base/domain/repository.base";
import type { ID } from "@base/domain/entity.base";
import type { Like } from "../domain/like.entity.ts";
import type { Result } from "@base/domain/result";
import type { EntityNotFoundError } from "@base/domain/error";

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
   * Retrieves a like by user and miniblog ID.
   * @param userID - The unique identifier of the user.
   * @param miniblogID - The unique identifier of the miniblog.
   */
  findByUserAndBlog(userID: ID, miniblogID: ID): Promise<Result<Like, EntityNotFoundError>>;

  /**
   * Deletes a like by user and miniblog ID.
   * Note: This is a convenience method over the base `delete(entity)`
   * @param userID - The unique identifier of the user.
   * @param miniblogID - The unique identifier of the miniblog.
   */
  deleteByUserAndBlog(userID: ID, miniblogID: ID): Promise<void>;
} & Repository<Like>;
