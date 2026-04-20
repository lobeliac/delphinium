import { DomainEvent } from "@base/domain/event";
import type { ID } from "@base/domain/entity.base";
import type { Nickname } from "../../domain/value-objects/index.ts";

/**
 * Event triggered when account profile information (nickname) is updated.
 */
export class AccountUpdatedEvent extends DomainEvent {
  public readonly nickname?: Nickname;

  constructor(accountId: ID, nickname?: Nickname) {
    super(accountId);
    this.nickname = nickname;
  }
}
