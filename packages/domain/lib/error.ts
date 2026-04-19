/**
 * Abstract class for Domain Errors with some common error types defined.
 */
export abstract class DomainError extends Error {
  public readonly timestamp: number;

  protected constructor(message: string) {
    super(message);
    this.name = "DomainError";
    this.timestamp = Date.now();
  }
}

/**
 * Error thrown when an entity is not found.
 */
export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
    this.name = "EntityNotFoundError";
  }
}

/**
 * Error thrown when an invariant violation occurs.
 * Such as miniblog exceed 100 words.
 */
export class InvariantViolationError extends DomainError {
  constructor(message: string) {
    super(`Invalid argument: ${message}`);
    this.name = "InvariantViolationError";
  }
}

/**
 * Thrown when an optimistic concurrency conflict occurs.
 * Example: two users trying to update the same entity at the same time.
 */
export class ConcurrencyError extends DomainError {
  constructor(entityName: string, entityId: string) {
    super(`Conflict detected: ${entityName} with ID ${entityId} was modified by another process.`);
    this.name = "ConcurrencyError";
  }
}

/**
 * Thrown when an action is performed that is invalid due to the current state.
 * Example: trying to delete a non-existent entity.
 */
export class IllegalStateError extends DomainError {
  constructor(message: string) {
    super(`Illegal state: ${message}`);
    this.name = "IllegalStateError";
  }
}
