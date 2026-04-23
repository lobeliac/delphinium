import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.ts";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { CommandBus } from "@base/domain/command-bus";
import { PrismaService } from "../../infrastructure/database/prisma.ts";
import { registry } from "../swagger.ts";
import {
  CreateMiniblogCommand,
  UpdateMiniblogCommand,
  DeleteMiniblogCommand
} from "@slice/miniblog/commands";
import {
  MiniblogContent,
  MiniblogVisibilityVO,
  MiniblogVisibilityEnum
} from "@slice/miniblog/domain";
import { DomainError } from "@base/domain/error";

// Validation Schemas
const CreateMiniblogSchema = registry.register(
  "CreateMiniblogInput",
  z.object({
    content: z
      .string()
      .min(1)
      .max(280)
      .openapi({ description: "Content of the miniblog", example: "Hello World!" }),
    visibility: z.nativeEnum(MiniblogVisibilityEnum).optional().openapi({
      description: "Visibility of the miniblog",
      example: MiniblogVisibilityEnum.PUBLIC
    })
  })
);

const UpdateMiniblogSchema = registry.register(
  "UpdateMiniblogInput",
  z.object({
    content: z
      .string()
      .min(1)
      .max(280)
      .optional()
      .openapi({ description: "New content of the miniblog", example: "Updated content!" }),
    visibility: z.nativeEnum(MiniblogVisibilityEnum).optional().openapi({
      description: "New visibility of the miniblog",
      example: MiniblogVisibilityEnum.PRIVATE
    })
  })
);

registry.registerPath({
  method: "post",
  path: "/api/miniblogs",
  summary: "Create a new miniblog",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: CreateMiniblogSchema } } }
  },
  responses: {
    201: { description: "Miniblog created successfully." },
    400: { description: "Validation error or Domain invariant violation" },
    401: { description: "Unauthorized" },
    500: { description: "Internal server error" }
  }
});

registry.registerPath({
  method: "put",
  path: "/api/miniblogs/{id}",
  summary: "Update an existing miniblog",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "ID of the miniblog to update",
      schema: { type: "string" }
    }
  ],
  request: {
    body: { content: { "application/json": { schema: UpdateMiniblogSchema } } }
  },
  responses: {
    200: { description: "Miniblog updated successfully." },
    400: { description: "Validation error or Domain invariant violation" },
    401: { description: "Unauthorized" },
    404: { description: "Miniblog not found" },
    500: { description: "Internal server error" }
  }
});

registry.registerPath({
  method: "delete",
  path: "/api/miniblogs/{id}",
  summary: "Delete an existing miniblog",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "ID of the miniblog to delete",
      schema: { type: "string" }
    }
  ],
  responses: {
    200: { description: "Miniblog deleted successfully." },
    401: { description: "Unauthorized" },
    404: { description: "Miniblog not found" },
    500: { description: "Internal server error" }
  }
});

registry.registerPath({
  method: "get",
  path: "/api/miniblogs",
  summary: "Get a list of miniblogs (Feed)",
  responses: {
    200: { description: "List of miniblogs" },
    500: { description: "Internal server error" }
  }
});

@injectable()
export class MiniblogController {
  private readonly commandBus: CommandBus;
  private readonly prisma: PrismaService;

  constructor(
    @inject(CommandBus) commandBus: CommandBus,
    @inject(PrismaService) prisma: PrismaService
  ) {
    this.commandBus = commandBus;
    this.prisma = prisma;
  }

  public createMiniblog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = CreateMiniblogSchema.parse(req.body);
      const authorId = req.user.sub as string;

      const contentResult = MiniblogContent.create(parsed.content);
      if (!contentResult.ok) {
        throw contentResult.error;
      }

      let visibilityVO;
      if (parsed.visibility) {
        visibilityVO = MiniblogVisibilityVO.create(parsed.visibility);
      }

      const command = new CreateMiniblogCommand({
        authorId,
        content: contentResult.value,
        visibility: visibilityVO
      });

      await this.commandBus.execute(command);
      res.status(201).json({ message: "Miniblog created successfully." });
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

  public updateMiniblog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = UpdateMiniblogSchema.parse(req.body);
      const miniblogId = req.params.id as string;

      let contentVO;
      if (parsed.content) {
        const contentResult = MiniblogContent.create(parsed.content);
        if (!contentResult.ok) {
          throw contentResult.error;
        }
        contentVO = contentResult.value;
      }

      let visibilityVO;
      if (parsed.visibility) {
        visibilityVO = MiniblogVisibilityVO.create(parsed.visibility);
      }

      const command = new UpdateMiniblogCommand({
        miniblogId,
        content: contentVO,
        visibility: visibilityVO
      });

      await this.commandBus.execute(command);
      res.status(200).json({ message: "Miniblog updated successfully." });
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

  public deleteMiniblog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const miniblogId = req.params.id as string;

      const command = new DeleteMiniblogCommand({
        miniblogId
      });

      await this.commandBus.execute(command);
      res.status(200).json({ message: "Miniblog deleted successfully." });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  public getMiniblogsByUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const isOwner = req.user?.sub === userId;

      const rows = await this.prisma.miniblog.findMany({
        where: {
          authorID: userId,
          ...(isOwner ? {} : { visibility: "PUBLIC" })
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          author: { include: { account: true } },
          _count: { select: { likes: true, comments: true } },
          ...(req.user?.sub
            ? {
                likes: {
                  where: { userID: req.user.sub },
                  select: { id: true }
                }
              }
            : {})
        }
      });

      const miniblogs = rows.map((r: any) => ({
        id: r.id,
        content: r.content,
        authorId: r.authorID,
        authorDisplayName: r.author.displayName,
        authorNickname: r.author.account?.nickname || "unknown",
        visibility: r.visibility,
        createdAt: r.createdAt,
        likesCount: r._count.likes,
        isLiked: r.likes ? r.likes.length > 0 : false
      }));

      res.status(200).json(miniblogs);
    } catch (error) {
      console.error("Error in getMiniblogsByUser:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getMiniblogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const rows = await this.prisma.miniblog.findMany({
        where: { visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          author: { include: { account: true } },
          _count: { select: { likes: true, comments: true } },
          ...(req.user?.sub
            ? {
                likes: {
                  where: { userID: req.user.sub },
                  select: { id: true }
                }
              }
            : {})
        }
      });

      const miniblogs = rows.map((r: any) => ({
        id: r.id,
        content: r.content,
        authorId: r.authorID,
        authorDisplayName: r.author.displayName,
        authorNickname: r.author.account?.nickname || "unknown",
        visibility: r.visibility,
        createdAt: r.createdAt,
        likesCount: r._count.likes,
        isLiked: r.likes ? r.likes.length > 0 : false
      }));

      res.status(200).json(miniblogs);
    } catch (error) {
      console.error("Error in getMiniblogs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
