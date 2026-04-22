import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../../application/services/auth.service.ts";
import { AuthenticationError } from "@base/domain/error";
import { User, Nickname, Account, Password, DisplayName, Bio } from "@slice/identity/domain";
import type { UserRepository, AccountRepository } from "@slice/identity/repository";
import type { CryptoService } from "../../../application/services/crypto.service.ts";
import jwt from "jsonwebtoken";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn()
  }
}));

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepo: UserRepository;
  let mockAccountRepo: AccountRepository;
  let mockCryptoService: CryptoService;

  beforeEach(() => {
    mockUserRepo = {
      findByNickname: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as unknown as UserRepository;

    mockAccountRepo = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn()
    } as unknown as AccountRepository;

    mockCryptoService = {
      hashPassword: vi.fn(),
      comparePassword: vi.fn()
    } as unknown as CryptoService;

    authService = new AuthService(mockAccountRepo, mockUserRepo, mockCryptoService);
  });

  describe("login", () => {
    it("should return a JWT token for valid credentials", async () => {
      // Setup mocks
      const nicknameResult = Nickname.create("validuser");
      const passwordResult = Password.create("ValidPass123!");
      const displayNameResult = DisplayName.create("Valid User");
      const bioResult = Bio.create("");

      expect(nicknameResult.ok).toBe(true);
      expect(passwordResult.ok).toBe(true);
      expect(displayNameResult.ok).toBe(true);
      expect(bioResult.ok).toBe(true);

      const user = User.reconstitute(
        {
          accountID: "account-id",
          displayName: displayNameResult.value,
          bio: bioResult.value,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        "user-id"
      );

      const account = Account.reconstitute(
        {
          nickname: nicknameResult.value,
          password: passwordResult.value,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        "account-id"
      );

      vi.mocked(mockUserRepo.findByNickname).mockResolvedValue({ ok: true, value: user });
      vi.mocked(mockAccountRepo.findById).mockResolvedValue({ ok: true, value: account });
      vi.mocked(mockCryptoService.comparePassword).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue("mocked.jwt.token" as any);

      // Execute
      const result = await authService.login("validuser", "ValidPass123!");

      // Verify
      expect(result.accessToken).toBe("mocked.jwt.token");
      expect(mockUserRepo.findByNickname).toHaveBeenCalled();
      expect(mockAccountRepo.findById).toHaveBeenCalledWith("account-id");
      expect(mockCryptoService.comparePassword).toHaveBeenCalledWith(
        "ValidPass123!",
        account.password.value
      );
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should throw AuthenticationError if user is not found", async () => {
      vi.mocked(mockUserRepo.findByNickname).mockResolvedValue({
        ok: false,
        error: new Error("Not found")
      } as any);

      await expect(authService.login("validuser", "Pass123!")).rejects.toThrow(AuthenticationError);
      await expect(authService.login("validuser", "Pass123!")).rejects.toThrow(
        "Invalid credentials."
      );
    });

    it("should throw AuthenticationError if password does not match", async () => {
      const nicknameResult = Nickname.create("validuser");
      const passwordResult = Password.create("ValidPass123!");
      const displayNameResult = DisplayName.create("Valid User");
      const bioResult = Bio.create("");

      expect(nicknameResult.ok).toBe(true);
      expect(passwordResult.ok).toBe(true);
      expect(displayNameResult.ok).toBe(true);
      expect(bioResult.ok).toBe(true);

      const user = User.reconstitute(
        {
          accountID: "account-id",
          displayName: displayNameResult.value,
          bio: bioResult.value,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        "user-id"
      );

      const account = Account.reconstitute(
        {
          nickname: nicknameResult.value,
          password: passwordResult.value,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        "account-id"
      );

      vi.mocked(mockUserRepo.findByNickname).mockResolvedValue({ ok: true, value: user });
      vi.mocked(mockAccountRepo.findById).mockResolvedValue({ ok: true, value: account });
      vi.mocked(mockCryptoService.comparePassword).mockResolvedValue(false); // Bad password

      await expect(authService.login("validuser", "WrongPass1!")).rejects.toThrow(
        AuthenticationError
      );
    });

    it("should throw a domain error if nickname format is invalid", async () => {
      // "ab" is too short for a nickname
      await expect(authService.login("ab", "Pass123!")).rejects.toThrow();
      expect(mockUserRepo.findByNickname).not.toHaveBeenCalled();
    });
  });
});
