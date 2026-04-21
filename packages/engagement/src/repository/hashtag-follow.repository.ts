import type { Repository } from "@base/domain/repository.base";
import type { ID } from "@base/domain/entity.base";
import type { HashtagFollow } from "../domain/hashtag-follow.entity.ts";

export type HashtagFollowRepository = {
  /**
   * Retrieves all hashtag follows for a specific user.
   * @param userID - The unique identifier of the user.
   */
  findByUser(userID: ID): Promise<HashtagFollow[]>;

  /**
   * Retrieves all users following a specific hashtag.
   * @param hashtag - The hashtag string.
   */
  findByHashtag(hashtag: string): Promise<HashtagFollow[]>;

  /**
   * Deletes a specific hashtag follow for a user.
   * @param userID - The user ID.
   * @param hashtag - The hashtag string.
   */
  deleteByUserAndHashtag(userID: ID, hashtag: string): Promise<void>;
} & Repository<HashtagFollow>;
