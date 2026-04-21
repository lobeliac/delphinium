import { EntityNotFoundError } from "@base/domain/error";
import type { ID } from "@base/domain/entity.base";

/**
 * Error thrown when a miniblog cannot be found.
 */
export class MiniblogNotFoundError extends EntityNotFoundError {
  constructor(miniblogID: ID) {
    super("Miniblog", miniblogID);
    this.name = "MiniblogNotFoundError";
  }
}
