import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { TYPES as IdentityTypes } from "../command-handlers/identity/register-account.handler.ts";
import type { AccountRepository, UserRepository } from "@slice/identity/repository";
import { Nickname } from "@slice/identity/domain";
import type { CryptoService } from "./crypto.service.ts";
import { AuthenticationError } from "@base/domain/error";

const JWT_SECRET = process.env.JWT_SECRET ?? "super-secret-fallback-key";

export const TYPES = {
  ...IdentityTypes,
  AuthService: Symbol.for("AuthService")
};

export type AuthTokens = {
  accessToken: string;
};

@injectable()
export class AuthService {
  private readonly accountRepo: AccountRepository;
  private readonly userRepo: UserRepository;
  private readonly cryptoService: CryptoService;

  constructor(
    @inject(TYPES.AccountRepository) accountRepo: AccountRepository,
    @inject(TYPES.UserRepository) userRepo: UserRepository,
    @inject(TYPES.CryptoService) cryptoService: CryptoService
  ) {
    this.accountRepo = accountRepo;
    this.userRepo = userRepo;
    this.cryptoService = cryptoService;
  }

  async login(nicknameStr: string, passwordStr: string): Promise<AuthTokens> {
    const nicknameResult = Nickname.create(nicknameStr);
    if (!nicknameResult.ok) {
      throw nicknameResult.error;
    }

    // 1. Fetch user by nickname
    // Using userRepo.findByNickname which delegates to Account and returns the associated User
    const userResult = await this.userRepo.findByNickname(nicknameResult.value);
    if (!userResult.ok) {
      throw new AuthenticationError("Invalid credentials.");
    }

    const user = userResult.value;

    // 2. Fetch the corresponding account to verify password
    const accountResult = await this.accountRepo.findById(user.accountID);
    if (!accountResult.ok) {
      throw new AuthenticationError("Invalid credentials.");
    }

    const account = accountResult.value;

    // 3. Verify password
    const isPasswordValid = await this.cryptoService.comparePassword(
      passwordStr,
      account.password.value
    );
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials.");
    }

    // 4. Generate JWT
    const payload = {
      sub: user.id, // Subject is User ID
      accountId: account.id,
      displayName: user.displayName.value,
      nickname: account.nickname.value
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return { accessToken };
  }

  verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, JWT_SECRET);
  }
}
