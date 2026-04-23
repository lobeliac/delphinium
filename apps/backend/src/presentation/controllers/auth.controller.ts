import type { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { AuthService } from "../../application/services/auth.service.ts";
import { CommandBus } from "@base/domain/command-bus";
import { RegisterAccountCommand } from "@slice/identity/commands";
import { Nickname, Password, DisplayName } from "@slice/identity/domain";
import { AuthenticationError, DomainError } from "@base/domain/error";
import { registry } from "../swagger.ts";

// Validation Schemas
const RegisterSchema = registry.register(
  "RegisterInput",
  z.object({
    nickname: z
      .string()
      .min(3)
      .max(20)
      .trim()
      .openapi({ description: "User's nickname", example: "cooluser123" }),
    password: z
      .string()
      .min(8)
      .openapi({ description: "User's password", example: "StrongPass1!" }),
    displayName: z
      .string()
      .min(1)
      .max(50)
      .trim()
      .openapi({ description: "User's display name", example: "Cool User" })
  })
);

const LoginSchema = registry.register(
  "LoginInput",
  z.object({
    nickname: z.string().trim().openapi({ description: "User's nickname", example: "cooluser123" }),
    password: z.string().openapi({ description: "User's password", example: "StrongPass1!" })
  })
);

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  summary: "Register a new user account",
  request: {
    body: {
      content: { "application/json": { schema: RegisterSchema } }
    }
  },
  responses: {
    201: { description: "User registered successfully." },
    400: { description: "Validation error or Domain invariant violation" },
    500: { description: "Internal server error" }
  }
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  summary: "Log into an account",
  request: {
    body: {
      content: { "application/json": { schema: LoginSchema } }
    }
  },
  responses: {
    200: { description: "Login successful with token" },
    400: { description: "Validation error" },
    401: { description: "Invalid credentials" },
    500: { description: "Internal server error" }
  }
});

@injectable()
export class AuthController {
  private readonly authService: AuthService;
  private readonly commandBus: CommandBus;

  constructor(
    @inject(AuthService) authService: AuthService,
    @inject(CommandBus) commandBus: CommandBus
  ) {
    this.authService = authService;
    this.commandBus = commandBus;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate Input
      const parsed = RegisterSchema.parse(req.body);

      // 2. Sanitize Input (even though it's identity, good practice)
      const sanitizedNickname = DOMPurify.sanitize(parsed.nickname);
      const sanitizedDisplayName = DOMPurify.sanitize(parsed.displayName);

      // 3. Create Value Objects
      const nicknameResult = Nickname.create(sanitizedNickname);
      const passwordResult = Password.create(parsed.password);
      const displayNameResult = DisplayName.create(sanitizedDisplayName);

      if (!nicknameResult.ok) {
        throw nicknameResult.error;
      }
      if (!passwordResult.ok) {
        throw passwordResult.error;
      }
      if (!displayNameResult.ok) {
        throw displayNameResult.error;
      }

      // 4. Dispatch Command
      const command = new RegisterAccountCommand({
        nickname: nicknameResult.value,
        password: passwordResult.value,
        displayName: displayNameResult.value
      });

      await this.commandBus.execute(command);

      // 5. Success
      res.status(201).json({ message: "User registered successfully." });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = LoginSchema.parse(req.body);
      const tokens = await this.authService.login(parsed.nickname, parsed.password);
      res.status(200).json({ message: "Login successful", ...tokens });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else if (error instanceof AuthenticationError) {
        res.status(401).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    // In a stateless JWT system, logout is mostly a client-side operation
    // (deleting the token from local storage or cookie).
    // A more advanced system would blacklist the token in Redis.
    res.status(200).json({ message: "Logout successful" });
  };
}
