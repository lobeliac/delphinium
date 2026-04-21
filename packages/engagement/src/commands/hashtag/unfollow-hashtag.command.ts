import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type UnfollowHashtagPayload = {
  userID: ID;
  hashtag: string;
};

export class UnfollowHashtagCommand extends BaseCommand<UnfollowHashtagPayload> {
  constructor(payload: UnfollowHashtagPayload) {
    super({ payload });
  }
}
