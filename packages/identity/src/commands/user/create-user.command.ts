import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { Bio, DisplayName } from "../../domain/value-objects/index.ts";

/** Payload for creating a new user profile. */
type CreateUserPayload = {
  accountId: ID;
  displayName: DisplayName;
  bio?: Bio;
};

/**
 * Command to create a new user associated with an existing account.
 */
export class CreateUserCommand extends BaseCommand<CreateUserPayload> {
  constructor(props: CreateUserPayload) {
    super({ payload: props });
  }
}
