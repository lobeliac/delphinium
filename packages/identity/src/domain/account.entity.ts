import { Entity } from "@base/domain/entity.base";
import type { ID } from "@base/domain/entity.base";

import type { Nickname, Password } from "./value-objects/index.js";
import { AccountRegisteredEvent } from "../events/account/account-registered.event.ts";
import { PasswordUpdatedEvent } from "../events/account/account-password-updated.event.ts";
import { AccountDeletedEvent } from "../events/account/account-deleted.event.js";
import { AccountUpdatedEvent } from "../events/account/account-updated.event.js";

/** Properties defining an Account. */
export type AccountProps = {
  nickname: Nickname;
  password: Password;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Aggregate Root representing a system Account.
 * Manages security credentials and core identity.
 */
export class Account extends Entity<AccountProps> {
  protected constructor(accountID: ID, props: AccountProps) {
    super(accountID, props, props.createdAt ?? new Date(), props.updatedAt ?? new Date());
  }

  /**
   * Creates a new Account with a unique ID and triggers a registration event.
   */
  public static create(
    accountProps: Omit<AccountProps, "createdAt" | "updatedAt">,
    accountID?: ID
  ): Account {
    const account = new Account(accountID ?? crypto.randomUUID(), {
      ...accountProps,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const accountEvent = new AccountRegisteredEvent(account.id);
    account.addDomainEvent(accountEvent);
    return account;
  }

  /** Updates the account nickname and records the change. */
  updateNickname(nickname: Nickname): void {
    this.props.nickname = nickname;
    this._updatedAt = new Date();
    this.addDomainEvent(new AccountUpdatedEvent(this.id, this.props.nickname));
  }

  /** Updates the account password and records the change. */
  updatePassword(password: Password): void {
    this.props.password = password;
    this._updatedAt = new Date();
    this.addDomainEvent(new PasswordUpdatedEvent(this.id));
  }

  /** Marks the account for deletion and triggers a deletion event. */
  delete(): void {
    this.addDomainEvent(new AccountDeletedEvent(this.id));
  }
}
