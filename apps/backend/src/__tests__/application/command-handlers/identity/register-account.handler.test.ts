import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterAccountCommandHandler } from "../../../../application/command-handlers/identity/register-account.handler.ts";
import { RegisterAccountCommand } from "@slice/identity/commands";
import { Nickname, Password, DisplayName } from "@slice/identity/domain";
import { AccountRegisteredEvent, UserRegisteredEvent } from "@slice/identity/events";
import type { AccountRepository, UserRepository } from "@slice/identity/repository";
import type { EventBus } from "@base/domain/event";
import type { CryptoService } from "../../../../application/services/crypto.service.ts";

describe("RegisterAccountCommandHandler", () => {
  let handler: RegisterAccountCommandHandler;
  let mockAccountRepo: AccountRepository;
  let mockUserRepo: UserRepository;
  let mockEventBus: EventBus;
  let mockCryptoService: CryptoService;

  beforeEach(() => {
    mockAccountRepo = {
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as AccountRepository;

    mockUserRepo = {
      findById: vi.fn(),
      findByNickname: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as UserRepository;

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    } as EventBus;

    mockCryptoService = {
      hashPassword: vi.fn().mockResolvedValue("hashed-password-123"),
      comparePassword: vi.fn()
    } as unknown as CryptoService;

    handler = new RegisterAccountCommandHandler(
      mockAccountRepo,
      mockUserRepo,
      mockEventBus,
      mockCryptoService
    );
  });

  it("should hash password, create account and user, save to repos, and publish events", async () => {
    // Setup
    const nicknameResult = Nickname.create("newuser");
    const passwordResult = Password.create("StrongPass1!");
    const displayNameResult = DisplayName.create("New User");

    expect(nicknameResult.ok).toBe(true);
    expect(passwordResult.ok).toBe(true);
    expect(displayNameResult.ok).toBe(true);

    const command = new RegisterAccountCommand({
      nickname: nicknameResult.value,
      password: passwordResult.value,
      displayName: displayNameResult.value
    });

    // Execute
    await handler.handle(command);

    // Verify Crypto Service
    expect(mockCryptoService.hashPassword).toHaveBeenCalledWith("StrongPass1!");

    // Verify Account Save
    expect(mockAccountRepo.save).toHaveBeenCalledTimes(1);
    const savedAccount = vi.mocked(mockAccountRepo.save).mock.calls[0][0];
    expect(savedAccount.nickname.value).toBe("newuser");
    expect(savedAccount.password.value).toBe("hashed-password-123");

    // Verify User Save
    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
    const savedUser = vi.mocked(mockUserRepo.save).mock.calls[0][0];
    expect(savedUser.displayName.value).toBe("New User");
    expect(savedUser.accountID).toBe(savedAccount.id);
    expect(savedUser.bio.value).toBe(""); // Default bio

    // Verify Events Published
    expect(mockEventBus.publish).toHaveBeenCalledTimes(2);

    const publishedEvent1 = vi.mocked(mockEventBus.publish).mock.calls[0][0];
    const publishedEvent2 = vi.mocked(mockEventBus.publish).mock.calls[1][0];

    // We expect both an AccountRegisteredEvent and a UserRegisteredEvent
    expect(publishedEvent1).toBeInstanceOf(AccountRegisteredEvent);
    expect(publishedEvent2).toBeInstanceOf(UserRegisteredEvent);
  });
});
