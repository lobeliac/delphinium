import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { Password } from "../../domain/value-objects/password.value-object.ts";

/** Payload for updating an account password. */
type UpdateAccountPasswordPayload = {
  accountId: ID;
  currentPassword: Password;
  newPassword: Password;
};

/**
 * Command to initiate the process of updating an account's password.
 */
export class UpdateAccountPasswordCommand extends BaseCommand<UpdateAccountPasswordPayload> {
  constructor(props: UpdateAccountPasswordPayload) {
    super({ payload: props });
  }
}
