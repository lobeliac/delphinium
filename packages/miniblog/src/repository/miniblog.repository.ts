import type { Repository } from "@base/domain/repository.base";
import type { Miniblog } from "../domain/miniblog.entity.js";
import type { ID } from "@base/domain/entity.base";

/**
 * Repository interface for managing {@link Miniblog} entities.
 */
export type MiniblogRepository = {
  /**
   * Retrieves all miniblogs belonging to a specific author.
   *
   * @param authorID The unique identifier of the author.
   * @returns A promise that resolves to an array of {@link Miniblog} entities.
   */
  findAllByAuthor(authorID: ID): Promise<Miniblog[]>;
} & Repository<Miniblog>;
