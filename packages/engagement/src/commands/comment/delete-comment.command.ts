import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type DeleteCommentPayload = {
  commentID: ID;
};

export class DeleteCommentCommand extends BaseCommand<DeleteCommentPayload> {
  constructor(deleteCommentPayload: DeleteCommentPayload) {
    super({ payload: deleteCommentPayload });
  }
}
