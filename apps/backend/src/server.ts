// oxlint-disable-next-line import/no-unassigned-import
import "reflect-metadata";
import { container } from "./infrastructure/di/inversify.config.ts";
import express from "express";
import cors from "cors";
import { authRouter } from "./presentation/routes/auth.routes.ts";
import { miniblogRouter } from "./presentation/routes/miniblog.routes.ts";
import { engagementRouter } from "./presentation/routes/engagement.routes.ts";
import { requireAuth } from "./presentation/middlewares/auth.middleware.ts";
import { setupSwagger } from "./presentation/swagger.ts";

import { CommandBus } from "@base/domain/command-bus";

// Identity Commands
import { RegisterAccountCommand } from "@slice/identity/commands";
import { RegisterAccountCommandHandler } from "./application/command-handlers/identity/register-account.handler.ts";

// Miniblog Commands
import {
  CreateMiniblogCommand,
  UpdateMiniblogCommand,
  DeleteMiniblogCommand
} from "@slice/miniblog/commands";
import { CreateMiniblogCommandHandler } from "./application/command-handlers/miniblog/create-miniblog.handler.ts";
import { UpdateMiniblogCommandHandler } from "./application/command-handlers/miniblog/update-miniblog.handler.ts";
import { DeleteMiniblogCommandHandler } from "./application/command-handlers/miniblog/delete-miniblog.handler.ts";

// Engagement Commands
import {
  CreateLikeCommand,
  RemoveLikeCommand,
  CreateCommentCommand,
  UpdateCommentCommand,
  DeleteCommentCommand,
  FollowHashtagCommand,
  UnfollowHashtagCommand,
  TagMiniblogCommand,
  UntagMiniblogCommand,
  CreateNotificationCommand,
  MarkNotificationReadCommand
} from "@slice/engagement/commands";

import { CreateLikeCommandHandler } from "./application/command-handlers/engagement/like/create-like.handler.ts";
import { RemoveLikeCommandHandler } from "./application/command-handlers/engagement/like/remove-like.handler.ts";
import { CreateCommentCommandHandler } from "./application/command-handlers/engagement/comment/create-comment.handler.ts";
import { UpdateCommentCommandHandler } from "./application/command-handlers/engagement/comment/update-comment.handler.ts";
import { DeleteCommentCommandHandler } from "./application/command-handlers/engagement/comment/delete-comment.handler.ts";
import { FollowHashtagCommandHandler } from "./application/command-handlers/engagement/hashtag/follow-hashtag.handler.ts";
import { UnfollowHashtagCommandHandler } from "./application/command-handlers/engagement/hashtag/unfollow-hashtag.handler.ts";
import { TagMiniblogCommandHandler } from "./application/command-handlers/engagement/hashtag/tag-miniblog.handler.ts";
import { UntagMiniblogCommandHandler } from "./application/command-handlers/engagement/hashtag/untag-miniblog.handler.ts";
import { CreateNotificationCommandHandler } from "./application/command-handlers/engagement/notification/create-notification.handler.ts";
import { MarkNotificationReadCommandHandler } from "./application/command-handlers/engagement/notification/mark-notification-read.handler.ts";

const app = express();
app.use(cors());
const port = process.env.PORT ?? 3000;

// Register Command Handlers
const commandBus = container.get<CommandBus>(CommandBus);
commandBus.register(
  RegisterAccountCommand,
  container.get<RegisterAccountCommandHandler>(RegisterAccountCommandHandler)
);

commandBus.register(
  CreateMiniblogCommand,
  container.get<CreateMiniblogCommandHandler>(CreateMiniblogCommandHandler)
);
commandBus.register(
  UpdateMiniblogCommand,
  container.get<UpdateMiniblogCommandHandler>(UpdateMiniblogCommandHandler)
);
commandBus.register(
  DeleteMiniblogCommand,
  container.get<DeleteMiniblogCommandHandler>(DeleteMiniblogCommandHandler)
);

commandBus.register(
  CreateLikeCommand,
  container.get<CreateLikeCommandHandler>(CreateLikeCommandHandler)
);
commandBus.register(
  RemoveLikeCommand,
  container.get<RemoveLikeCommandHandler>(RemoveLikeCommandHandler)
);
commandBus.register(
  CreateCommentCommand,
  container.get<CreateCommentCommandHandler>(CreateCommentCommandHandler)
);
commandBus.register(
  UpdateCommentCommand,
  container.get<UpdateCommentCommandHandler>(UpdateCommentCommandHandler)
);
commandBus.register(
  DeleteCommentCommand,
  container.get<DeleteCommentCommandHandler>(DeleteCommentCommandHandler)
);
commandBus.register(
  FollowHashtagCommand,
  container.get<FollowHashtagCommandHandler>(FollowHashtagCommandHandler)
);
commandBus.register(
  UnfollowHashtagCommand,
  container.get<UnfollowHashtagCommandHandler>(UnfollowHashtagCommandHandler)
);
commandBus.register(
  TagMiniblogCommand,
  container.get<TagMiniblogCommandHandler>(TagMiniblogCommandHandler)
);
commandBus.register(
  UntagMiniblogCommand,
  container.get<UntagMiniblogCommandHandler>(UntagMiniblogCommandHandler)
);
commandBus.register(
  CreateNotificationCommand,
  container.get<CreateNotificationCommandHandler>(CreateNotificationCommandHandler)
);
commandBus.register(
  MarkNotificationReadCommand,
  container.get<MarkNotificationReadCommandHandler>(MarkNotificationReadCommandHandler)
);

app.use(express.json());

// Setup Swagger UI
setupSwagger(app);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/miniblogs", miniblogRouter);
app.use("/api/engagement", engagementRouter);

// Protected Test Route
app.get("/api/me", requireAuth, (req: any, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

app.listen(port, () => {
  // oxlint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
