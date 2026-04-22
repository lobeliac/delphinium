import { Router } from "express";
import { container } from "../../infrastructure/di/inversify.config.ts";
import { EngagementController } from "../controllers/engagement.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

export const engagementRouter = Router();
const engagementController = container.get<EngagementController>(EngagementController);

// All engagement routes require authentication
engagementRouter.use(requireAuth);

// Likes
engagementRouter.post("/likes/:miniblogId", engagementController.likeMiniblog);
engagementRouter.delete("/likes/:miniblogId", engagementController.removeLike);

// Comments
engagementRouter.post("/comments/:miniblogId", engagementController.createComment);
engagementRouter.put("/comments/:commentId", engagementController.updateComment);
engagementRouter.delete("/comments/:commentId", engagementController.deleteComment);

// Hashtags
engagementRouter.post("/hashtags/:hashtag/follow", engagementController.followHashtag);
engagementRouter.delete("/hashtags/:hashtag/follow", engagementController.unfollowHashtag);
