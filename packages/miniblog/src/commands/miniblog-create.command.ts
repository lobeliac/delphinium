import { BaseCommand } from "@base/domain/command.base";
import type { MiniblogContent, MiniblogVisibilityVO } from "../domain/value-objects/index.ts";
import type { ID } from "@base/domain/entity.base";

/**
 * Payload for the CreateMiniblogCommand.
 */
type CreateMiniblogPayload = {
  /** The ID of the author creating the blog. */
  authorId: ID;
  /** The initial content of the blog. */
  content: MiniblogContent;
  /** The initial visibility of the blog. */
  visibility?: MiniblogVisibilityVO;
};

/**
 * Command used to create a new miniblog.
 */
export class CreateMiniblogCommand extends BaseCommand<CreateMiniblogPayload> {
  constructor(props: CreateMiniblogPayload) {
    super({ payload: props });
  }
}
