import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type RemoveLikePayload = {
  userID: ID;
  miniblogID: ID;
};

export class RemoveLikeCommand extends BaseCommand<RemoveLikePayload> {
  constructor(payload: RemoveLikePayload) {
    super({ payload });
  }
}
