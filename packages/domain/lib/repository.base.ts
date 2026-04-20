import type { EntityNotFoundError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID, Entity } from "@base/domain/entity.base";

/**
 * A generic "type" for a repository that manages single type of entity to perform CRUD operations.
 */
export type Repository<T extends Entity<any>> = {
  /**
   * Retrieves an entity by its unique identifier.
   * @param id - The unique identifier of entity.
   * @returns The entity is found or EntityNotFoundError.
   */
  findById(id: ID): Promise<Result<T, EntityNotFoundError>>;

  /**
   * Persists the given entity to database.
   * For new entities, this performs an INSERT.
   * For existing entities, this performs an UPDATE.
   * @param entity - The entity to be persisted.
   */
  save(entity: T): Promise<void>;

  /**
   * Removes the given entity from database.
   * @param entity - The Entity to be deleted.
   */
  delete(entity: T): Promise<void>;
};
