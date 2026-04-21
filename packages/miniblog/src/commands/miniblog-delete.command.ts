import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

/**
 * Payload for the DeleteMiniblogCommand.
 */
type DeleteMiniblogPayload = {
  /** The ID of the miniblog to delete. */
  miniblogId: ID;
};

/**
 * Command used to delete a miniblog.
 */
export class DeleteMiniblogCommand extends BaseCommand<DeleteMiniblogPayload> {
  constructor(props: DeleteMiniblogPayload) {
    super({ payload: props });
  }
}
