import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type CreateLikePayload = {
  userID: ID;
  miniblogID: ID;
};

export class CreateLikeCommand extends BaseCommand<CreateLikePayload> {
  constructor(payload: CreateLikePayload) {
    super({ payload });
  }
}
