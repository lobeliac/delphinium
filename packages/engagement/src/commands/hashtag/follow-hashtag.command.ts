import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type FollowHashtagPayload = {
  userID: ID;
  hashtag: string;
};

export class FollowHashtagCommand extends BaseCommand<FollowHashtagPayload> {
  constructor(payload: FollowHashtagPayload) {
    super({ payload });
  }
}
