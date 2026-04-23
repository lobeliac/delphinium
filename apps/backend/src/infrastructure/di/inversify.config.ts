import "reflect-metadata";
import { Container } from "inversify";
import { PrismaService } from "../database/prisma.ts";

import type { EventBus } from "@base/domain/event";
import { BackendEventBus } from "../../application/event-bus.ts";
import { CommandBus } from "@base/domain/command-bus";

// Identity Domain
import type { AccountRepository, UserRepository } from "@slice/identity/repository";
import { PrismaAccountRepository } from "../repositories/identity/prisma-account.repository.ts";
import { PrismaUserRepository } from "../repositories/identity/prisma-user.repository.ts";
import {
  RegisterAccountCommandHandler,
  TYPES as IdentityHandlers
} from "../../application/command-handlers/identity/register-account.handler.ts";

// Miniblog Domain
import type { MiniblogRepository } from "@slice/miniblog/repository";
import { PrismaMiniblogRepository } from "../repositories/miniblog/prisma-miniblog.repository.ts";
import {
  CreateMiniblogCommandHandler,
  TYPES as MiniblogTypes
} from "../../application/command-handlers/miniblog/create-miniblog.handler.ts";
import { UpdateMiniblogCommandHandler } from "../../application/command-handlers/miniblog/update-miniblog.handler.ts";
import { DeleteMiniblogCommandHandler } from "../../application/command-handlers/miniblog/delete-miniblog.handler.ts";

// Engagement Domain
import type {
  LikeRepository,
  CommentRepository,
  HashtagFollowRepository,
  MiniblogHashtagRepository,
  NotificationRepository
} from "@slice/engagement/repository";
import { PrismaLikeRepository } from "../repositories/engagement/prisma-like.repository.ts";
import { PrismaCommentRepository } from "../repositories/engagement/prisma-comment.repository.ts";
import { PrismaHashtagFollowRepository } from "../repositories/engagement/prisma-hashtag-follow.repository.ts";
import { PrismaMiniblogHashtagRepository } from "../repositories/engagement/prisma-miniblog-hashtag.repository.ts";
import { PrismaNotificationRepository } from "../repositories/engagement/prisma-notification.repository.ts";
import {
  CreateLikeCommandHandler,
  TYPES as EngagementTypes
} from "../../application/command-handlers/engagement/like/create-like.handler.ts";
import { RemoveLikeCommandHandler } from "../../application/command-handlers/engagement/like/remove-like.handler.ts";
import { CreateCommentCommandHandler } from "../../application/command-handlers/engagement/comment/create-comment.handler.ts";
import { UpdateCommentCommandHandler } from "../../application/command-handlers/engagement/comment/update-comment.handler.ts";
import { DeleteCommentCommandHandler } from "../../application/command-handlers/engagement/comment/delete-comment.handler.ts";
import { FollowHashtagCommandHandler } from "../../application/command-handlers/engagement/hashtag/follow-hashtag.handler.ts";
import { UnfollowHashtagCommandHandler } from "../../application/command-handlers/engagement/hashtag/unfollow-hashtag.handler.ts";
import { TagMiniblogCommandHandler } from "../../application/command-handlers/engagement/hashtag/tag-miniblog.handler.ts";
import { UntagMiniblogCommandHandler } from "../../application/command-handlers/engagement/hashtag/untag-miniblog.handler.ts";
import { CreateNotificationCommandHandler } from "../../application/command-handlers/engagement/notification/create-notification.handler.ts";
import { MarkNotificationReadCommandHandler } from "../../application/command-handlers/engagement/notification/mark-notification-read.handler.ts";

// Services
import { CryptoService } from "../../application/services/crypto.service.ts";
import { AuthService } from "../../application/services/auth.service.ts";

// Controllers
import { AuthController } from "../../presentation/controllers/auth.controller.ts";
import { MiniblogController } from "../../presentation/controllers/miniblog.controller.ts";
import { EngagementController } from "../../presentation/controllers/engagement.controller.ts";

const container = new Container();

// Core Services
container.bind<PrismaService>(PrismaService).toSelf().inSingletonScope();
container.bind<EventBus>(IdentityHandlers.EventBus).to(BackendEventBus).inSingletonScope();
container.bind<CommandBus>(CommandBus).toSelf().inSingletonScope();

// ----------------------------------------------------
// Repositories
// ----------------------------------------------------
container.bind<AccountRepository>(IdentityHandlers.AccountRepository).to(PrismaAccountRepository);
container.bind<UserRepository>(IdentityHandlers.UserRepository).to(PrismaUserRepository);

container.bind<MiniblogRepository>(MiniblogTypes.MiniblogRepository).to(PrismaMiniblogRepository);

container.bind<LikeRepository>(EngagementTypes.LikeRepository).to(PrismaLikeRepository);
container.bind<CommentRepository>(EngagementTypes.CommentRepository).to(PrismaCommentRepository);
container
  .bind<HashtagFollowRepository>(EngagementTypes.HashtagFollowRepository)
  .to(PrismaHashtagFollowRepository);
container
  .bind<MiniblogHashtagRepository>(EngagementTypes.MiniblogHashtagRepository)
  .to(PrismaMiniblogHashtagRepository);
container
  .bind<NotificationRepository>(EngagementTypes.NotificationRepository)
  .to(PrismaNotificationRepository);

// ----------------------------------------------------
// Command Handlers
// ----------------------------------------------------
// Identity
container.bind<RegisterAccountCommandHandler>(RegisterAccountCommandHandler).toSelf();

// Miniblog
container.bind<CreateMiniblogCommandHandler>(CreateMiniblogCommandHandler).toSelf();
container.bind<UpdateMiniblogCommandHandler>(UpdateMiniblogCommandHandler).toSelf();
container.bind<DeleteMiniblogCommandHandler>(DeleteMiniblogCommandHandler).toSelf();

// Engagement
container.bind<CreateLikeCommandHandler>(CreateLikeCommandHandler).toSelf();
container.bind<RemoveLikeCommandHandler>(RemoveLikeCommandHandler).toSelf();
container.bind<CreateCommentCommandHandler>(CreateCommentCommandHandler).toSelf();
container.bind<UpdateCommentCommandHandler>(UpdateCommentCommandHandler).toSelf();
container.bind<DeleteCommentCommandHandler>(DeleteCommentCommandHandler).toSelf();
container.bind<FollowHashtagCommandHandler>(FollowHashtagCommandHandler).toSelf();
container.bind<UnfollowHashtagCommandHandler>(UnfollowHashtagCommandHandler).toSelf();
container.bind<TagMiniblogCommandHandler>(TagMiniblogCommandHandler).toSelf();
container.bind<UntagMiniblogCommandHandler>(UntagMiniblogCommandHandler).toSelf();
container.bind<CreateNotificationCommandHandler>(CreateNotificationCommandHandler).toSelf();
container.bind<MarkNotificationReadCommandHandler>(MarkNotificationReadCommandHandler).toSelf();

container.bind<AuthController>(AuthController).toSelf();
container.bind<MiniblogController>(MiniblogController).toSelf();
container.bind<EngagementController>(EngagementController).toSelf();

//Services
container.bind<CryptoService>(IdentityHandlers.CryptoService).to(CryptoService);
container.bind<AuthService>(AuthService).toSelf();

export { container };
