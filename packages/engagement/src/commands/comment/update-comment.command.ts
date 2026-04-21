import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type UpdateCommentPayload = {
  commentID: ID;
  content: string;
};

export class UpdateCommentCommand extends BaseCommand<UpdateCommentPayload> {
  constructor(payload: UpdateCommentPayload) {
    super({ payload });
  }
}
