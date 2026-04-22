import { injectable, inject } from "inversify";
import type { CommentRepository } from "@slice/engagement/repository";
import { Comment, CommentContent } from "@slice/engagement/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError, IllegalStateError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaCommentRepository implements CommentRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findById(id: ID): Promise<Result<Comment, EntityNotFoundError>> {
    const data = await this.prisma.comment.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("Comment", id) };
    }
    const contentResult = CommentContent.create(data.content);
    if (!contentResult.ok) {
      throw new IllegalStateError("Invalid comment content in database");
    }
    return {
      ok: true,
      value: Comment.reconstitute(
        {
          userID: data.userID,
          miniblogID: data.miniblogID,
          content: contentResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    };
  }

  async save(entity: Comment): Promise<void> {
    await this.prisma.comment.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        userID: entity.userID,
        miniblogID: entity.miniblogID,
        content: entity.content.value,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: { content: entity.content.value, updatedAt: entity.updatedAt }
    });
  }

  async findByBlog(miniblogID: ID): Promise<Comment[]> {
    const rows = await this.prisma.comment.findMany({
      where: { miniblogID },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) => {
      const contentResult = CommentContent.create(data.content);
      if (!contentResult.ok) {
        throw new IllegalStateError("Invalid comment content in database");
      }
      return Comment.reconstitute(
        {
          userID: data.userID,
          miniblogID: data.miniblogID,
          content: contentResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      );
    });
  }
  async delete(entity: Comment): Promise<void> {
    await this.prisma.comment.delete({ where: { id: entity.id } });
  }
}
