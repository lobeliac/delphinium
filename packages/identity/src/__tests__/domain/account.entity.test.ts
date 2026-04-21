import { Account, Nickname, Password } from "../../domain/index.ts";
import { describe, it, expect } from "vitest";
import { AccountRegisteredEvent } from "../../events/index.ts";

describe("Account", () => {
  const newAccount = () => {
    return Account.create({
      nickname: Nickname.reconstitute("user123"),
      password: Password.reconstitute("SecurePass123!")
    });
  };

  it("should create an account", () => {
    const account = newAccount();

    expect(account.id).toBeDefined();
    expect(account.nickname.value).toBe("user123");
    expect(account.password.value).toBe("SecurePass123!");

    const events = account.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(AccountRegisteredEvent);
  });

  it("should update the nickname of an account", () => {
    const account = newAccount();
    account.updateNickname(Nickname.reconstitute("newuser123"));
    expect(account.nickname.value).toBe("newuser123");

    const events = account.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1].constructor.name).toBe("AccountUpdatedEvent");
  });

  it("should update the password of an account", () => {
    const account = newAccount();
    account.updatePassword(Password.reconstitute("NotSecurePass123!"));
    expect(account.password.value).toBe("NotSecurePass123!");

    const events = account.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1].constructor.name).toBe("PasswordUpdatedEvent");
  });

  it("should mark an account as deleted", () => {
    const account = newAccount();

    account.delete();

    const events = account.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1].constructor.name).toBe("AccountDeletedEvent");
  });
});
