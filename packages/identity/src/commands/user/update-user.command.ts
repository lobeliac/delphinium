import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { Bio, DisplayName } from "../../domain/value-objects/index.ts";

/** Payload for updating an existing user profile. */
type UpdateUserProfilePayload = {
  userId: ID;
  displayName?: DisplayName;
  bio?: Bio;
};

/**
 * Command to update a user's profile information (display name or bio).
 */
export class UpdateUserProfileCommand extends BaseCommand<UpdateUserProfilePayload> {
  constructor(props: UpdateUserProfilePayload) {
    super({ payload: props });
  }
}
