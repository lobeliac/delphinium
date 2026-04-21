import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type CreateCommentPayload = {
  userID: ID;
  miniblogID: ID;
  content: string;
};

export class CreateCommentCommand extends BaseCommand<CreateCommentPayload> {
  constructor(payload: CreateCommentPayload) {
    super({ payload });
  }
}
