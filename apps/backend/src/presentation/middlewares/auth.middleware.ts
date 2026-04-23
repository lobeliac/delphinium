import type { Request, Response, NextFunction } from "express";
import { container } from "../../infrastructure/di/inversify.config.ts";
import { AuthService } from "../../application/services/auth.service.ts";

export type AuthenticatedRequest = {
  user?: any;
} & Request;

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const authService = container.get<AuthService>(AuthService);
    const decoded = authService.verifyToken(token);
    req.user = decoded; // Contains sub (user ID), accountId, displayName, nickname
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const authService = container.get<AuthService>(AuthService);
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    // If token is invalid, just proceed as unauthenticated
    next();
  }
};
