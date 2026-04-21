import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type UntagMiniblogPayload = {
  miniblogID: ID;
  hashtag: string;
};

export class UntagMiniblogCommand extends BaseCommand<UntagMiniblogPayload> {
  constructor(payload: UntagMiniblogPayload) {
    super({ payload });
  }
}
