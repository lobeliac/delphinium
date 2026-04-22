import { Router } from "express";
import { container } from "../../infrastructure/di/inversify.config.ts";
import { AuthController } from "../controllers/auth.controller.ts";

export const authRouter = Router();
const authController = container.get<AuthController>(AuthController);

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
