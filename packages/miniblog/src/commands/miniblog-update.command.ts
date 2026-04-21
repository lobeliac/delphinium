import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";
import type { MiniblogContent, MiniblogVisibilityVO } from "../domain/value-objects/index.ts";

/**
 * Payload for the UpdateMiniblogCommand.
 */
type UpdateMiniblogPayload = {
  /** The ID of the miniblog to update. */
  miniblogId: ID;
  /** The new content for the miniblog, if provided. */
  content?: MiniblogContent;
  /** The new visibility for the miniblog, if provided. */
  visibility?: MiniblogVisibilityVO;
};

/**
 * Command used to update an existing miniblog.
 */
export class UpdateMiniblogCommand extends BaseCommand<UpdateMiniblogPayload> {
  constructor(props: UpdateMiniblogPayload) {
    super({ payload: props });
  }
}
