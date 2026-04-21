import { EntityNotFoundError } from "@base/domain/error";
import type { ID } from "@base/domain/entity.base";

/**
 * Error thrown when an account cannot be found.
 */
export class AccountNotFoundError extends EntityNotFoundError {
  constructor(accountID: ID) {
    super("Account", accountID);
    this.name = "AccountNotFoundError";
  }
}
