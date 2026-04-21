import type { Repository } from "@base/domain/repository.base";
import type { ID } from "@base/domain/entity.base";
import type { MiniblogHashtag } from "../domain/miniblog-hashtag.entity.ts";

export type MiniblogHashtagRepository = {
  /**
   * Retrieves all hashtags for a specific miniblog.
   * @param miniblogID - The unique identifier of the miniblog.
   */
  findByMiniblog(miniblogID: ID): Promise<MiniblogHashtag[]>;

  /**
   * Retrieves all miniblog associations for a specific hashtag string.
   * @param hashtag - The hashtag string to search for.
   */
  findByHashtag(hashtag: string): Promise<MiniblogHashtag[]>;

  /**
   * Deletes a specific hashtag association from a miniblog.
   * @param miniblogID - The miniblog ID.
   * @param hashtag - The hashtag string.
   */
  deleteByMiniblogAndHashtag(miniblogID: ID, hashtag: string): Promise<void>;
} & Repository<MiniblogHashtag>;
