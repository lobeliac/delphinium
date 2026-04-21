import { BaseCommand } from "@base/domain/command.base";
import type { ID } from "@base/domain/entity.base";

export type TagMiniblogPayload = {
  miniblogID: ID;
  hashtag: string;
};

export class TagMiniblogCommand extends BaseCommand<TagMiniblogPayload> {
  constructor(payload: TagMiniblogPayload) {
    super({ payload });
  }
}
