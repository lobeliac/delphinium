import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { Password } from "../../domain/value-objects/password.value-object.ts";

/**
 * Data required to execute the account deletion process.
 */
type DeleteAccountPayload = {
  /** The unique identifier of the account to be deleted. */
  accountId: ID;
  /** The user's password used for security verification during deletion. */
  password: Password;
};

/**
 * Command responsible for initiating the deletion of a user account.
 * This command ensures that the identity and authorization (via password) are bundled together.
 */
export class DeleteAccountCommand extends BaseCommand<DeleteAccountPayload> {
  /**
   * Creates an instance of DeleteAccountCommand.
   * @param props - The payload containing account ID and verification password.
   */
  constructor(props: DeleteAccountPayload) {
    super({ payload: props });
  }
}
