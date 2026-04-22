import { Router } from "express";
import { container } from "../../infrastructure/di/inversify.config.ts";
import { MiniblogController } from "../controllers/miniblog.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

export const miniblogRouter = Router();
const miniblogController = container.get<MiniblogController>(MiniblogController);

// All Miniblog routes require authentication (except maybe GET in a real app, but we'll protect all for now to be safe or just GET is public)
// Let's make GET public and the rest protected.
miniblogRouter.get("/", miniblogController.getMiniblogs);
miniblogRouter.post("/", requireAuth, miniblogController.createMiniblog);
miniblogRouter.put("/:id", requireAuth, miniblogController.updateMiniblog);
miniblogRouter.delete("/:id", requireAuth, miniblogController.deleteMiniblog);
