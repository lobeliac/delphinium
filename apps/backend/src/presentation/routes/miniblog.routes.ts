import { Router } from "express";
import { container } from "../../infrastructure/di/inversify.config.ts";
import { MiniblogController } from "../controllers/miniblog.controller.ts";
import { requireAuth, optionalAuth } from "../middlewares/auth.middleware.ts";

export const miniblogRouter = Router();
const miniblogController = container.get<MiniblogController>(MiniblogController);

miniblogRouter.get("/", optionalAuth, miniblogController.getMiniblogs);
miniblogRouter.get("/user/:userId", optionalAuth, miniblogController.getMiniblogsByUser);
miniblogRouter.post("/", requireAuth, miniblogController.createMiniblog);
miniblogRouter.put("/:id", requireAuth, miniblogController.updateMiniblog);
miniblogRouter.delete("/:id", requireAuth, miniblogController.deleteMiniblog);
