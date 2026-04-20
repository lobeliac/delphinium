import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { Nickname } from "../../domain/index.ts";

/** Payload for updating an account's nickname. */
type UpdateAccountPayload = {
  accountId: ID;
  nickname: Nickname;
};

/**
 * Command to update an existing account's nickname.
 */
export class UpdateAccountCommand extends BaseCommand<UpdateAccountPayload> {
  constructor(props: UpdateAccountPayload) {
    super({ payload: props });
  }
}
