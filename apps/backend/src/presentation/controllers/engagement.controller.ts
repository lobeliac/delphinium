import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.ts";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { CommandBus } from "@base/domain/command-bus";
import { registry } from "../swagger.ts";
import {
  CreateLikeCommand,
  RemoveLikeCommand,
  CreateCommentCommand,
  UpdateCommentCommand,
  DeleteCommentCommand,
  FollowHashtagCommand,
  UnfollowHashtagCommand
} from "@slice/engagement/commands";
import { DomainError } from "@base/domain/error";

// Validation Schemas
const CreateCommentSchema = registry.register(
  "CreateCommentInput",
  z.object({
    content: z
      .string()
      .min(1)
      .max(280)
      .openapi({ description: "Content of the comment", example: "Great post!" })
  })
);

const UpdateCommentSchema = registry.register(
  "UpdateCommentInput",
  z.object({
    content: z.string().min(1).max(280).openapi({
      description: "New content of the comment",
      example: "Actually, I changed my mind."
    })
  })
);

// Swagger Path Registrations
registry.registerPath({
  method: "post",
  path: "/api/engagement/likes/{miniblogId}",
  summary: "Like a miniblog",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "miniblogId",
      in: "path",
      required: true,
      description: "ID of the miniblog to like",
      schema: { type: "string" }
    }
  ],
  responses: {
    201: { description: "Liked successfully." },
    401: { description: "Unauthorized" },
    500: { description: "Internal error" }
  }
});

registry.registerPath({
  method: "delete",
  path: "/api/engagement/likes/{miniblogId}",
  summary: "Remove a like from a miniblog",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "miniblogId",
      in: "path",
      required: true,
      description: "ID of the miniblog to unlike",
      schema: { type: "string" }
    }
  ],
  responses: {
    200: { description: "Unliked successfully." },
    401: { description: "Unauthorized" },
    500: { description: "Internal error" }
  }
});

registry.registerPath({
  method: "post",
  path: "/api/engagement/comments/{miniblogId}",
  summary: "Add a comment to a miniblog",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "miniblogId",
      in: "path",
      required: true,
      description: "ID of the miniblog to comment on",
      schema: { type: "string" }
    }
  ],
  request: { body: { content: { "application/json": { schema: CreateCommentSchema } } } },
  responses: {
    201: { description: "Comment created successfully." },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
    500: { description: "Internal error" }
  }
});

registry.registerPath({
  method: "put",
  path: "/api/engagement/comments/{commentId}",
  summary: "Update an existing comment",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "commentId",
      in: "path",
      required: true,
      description: "ID of the comment",
      schema: { type: "string" }
    }
  ],
  request: { body: { content: { "application/json": { schema: UpdateCommentSchema } } } },
  responses: {
    200: { description: "Comment updated successfully." },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
    404: { description: "Not found" },
    500: { description: "Internal error" }
  }
});

registry.registerPath({
  method: "delete",
  path: "/api/engagement/comments/{commentId}",
  summary: "Delete an existing comment",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "commentId",
      in: "path",
      required: true,
      description: "ID of the comment",
      schema: { type: "string" }
    }
  ],
  responses: {
    200: { description: "Comment deleted successfully." },
    401: { description: "Unauthorized" },
    404: { description: "Not found" },
    500: { description: "Internal error" }
  }
});

registry.registerPath({
  method: "post",
  path: "/api/engagement/hashtags/{hashtag}/follow",
  summary: "Follow a hashtag",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "hashtag",
      in: "path",
      required: true,
      description: "The hashtag to follow (without #)",
      schema: { type: "string" }
    }
  ],
  responses: {
    201: { description: "Followed successfully." },
    401: { description: "Unauthorized" },
    500: { description: "Internal error" }
  }
});

registry.registerPath({
  method: "delete",
  path: "/api/engagement/hashtags/{hashtag}/follow",
  summary: "Unfollow a hashtag",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "hashtag",
      in: "path",
      required: true,
      description: "The hashtag to unfollow (without #)",
      schema: { type: "string" }
    }
  ],
  responses: {
    200: { description: "Unfollowed successfully." },
    401: { description: "Unauthorized" },
    500: { description: "Internal error" }
  }
});

@injectable()
export class EngagementController {
  private readonly commandBus: CommandBus;

  constructor(@inject(CommandBus) commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  // LIKES
  public likeMiniblog = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const miniblogId = req.params.miniblogId as string;
      const userId = req.user.sub as string;
      await this.commandBus.execute(
        new CreateLikeCommand({ userID: userId, miniblogID: miniblogId })
      );
      res.status(201).json({ message: "Liked successfully." });
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  public removeLike = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const miniblogId = req.params.miniblogId as string;
      const userId = req.user.sub as string;
      await this.commandBus.execute(
        new RemoveLikeCommand({ userID: userId, miniblogID: miniblogId })
      );
      res.status(200).json({ message: "Unliked successfully." });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  // COMMENTS
  public createComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsed = CreateCommentSchema.parse(req.body);
      const miniblogId = req.params.miniblogId as string;
      const userId = req.user.sub as string;
      await this.commandBus.execute(
        new CreateCommentCommand({
          userID: userId,
          miniblogID: miniblogId,
          content: parsed.content
        })
      );
      res.status(201).json({ message: "Comment created successfully." });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  public updateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parsed = UpdateCommentSchema.parse(req.body);
      const commentId = req.params.commentId as string;
      await this.commandBus.execute(
        new UpdateCommentCommand({ commentID: commentId, content: parsed.content })
      );
      res.status(200).json({ message: "Comment updated successfully." });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  public deleteComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const commentId = req.params.commentId as string;
      await this.commandBus.execute(new DeleteCommentCommand({ commentID: commentId }));
      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  // HASHTAGS
  public followHashtag = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const hashtag = req.params.hashtag as string;
      const userId = req.user.sub as string;
      await this.commandBus.execute(new FollowHashtagCommand({ userID: userId, hashtag }));
      res.status(201).json({ message: "Followed successfully." });
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  public unfollowHashtag = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const hashtag = req.params.hashtag as string;
      const userId = req.user.sub as string;
      await this.commandBus.execute(new UnfollowHashtagCommand({ userID: userId, hashtag }));
      res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
