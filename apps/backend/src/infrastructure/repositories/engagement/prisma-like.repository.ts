import { injectable, inject } from "inversify";
import type { LikeRepository } from "@slice/engagement/repository";
import { Like } from "@slice/engagement/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaLikeRepository implements LikeRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findById(id: ID): Promise<Result<Like, EntityNotFoundError>> {
    const data = await this.prisma.like.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("Like", id) };
    }
    return {
      ok: true,
      value: Like.reconstitute(
        {
          userID: data.userID,
          miniblogID: data.miniblogID,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    };
  }

  async save(entity: Like): Promise<void> {
    await this.prisma.like.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        userID: entity.userID,
        miniblogID: entity.miniblogID,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: { createdAt: entity.createdAt, updatedAt: entity.updatedAt }
    });
  }

  async findByUser(userID: ID): Promise<Like[]> {
    const rows = await this.prisma.like.findMany({
      where: { userID },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) =>
      Like.reconstitute(
        {
          userID: data.userID,
          miniblogID: data.miniblogID,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    );
  }

  async findByBlog(miniblogID: ID): Promise<Like[]> {
    const dataList = await this.prisma.like.findMany({ where: { miniblogID } });
    return dataList.map((data) =>
      Like.reconstitute(
        {
          userID: data.userID,
          miniblogID: data.miniblogID,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    );
  }

  async findByUserAndBlog(userID: ID, miniblogID: ID): Promise<Result<Like, EntityNotFoundError>> {
    const data = await this.prisma.like.findFirst({
      where: { userID, miniblogID }
    });

    if (!data) {
      return {
        ok: false,
        error: new EntityNotFoundError("Like", `userID=${userID}, miniblogID=${miniblogID}`)
      };
    }

    return {
      ok: true,
      value: Like.reconstitute(
        {
          userID: data.userID,
          miniblogID: data.miniblogID,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    };
  }

  async deleteByUserAndBlog(userID: ID, miniblogID: ID): Promise<void> {
    await this.prisma.like.deleteMany({ where: { userID, miniblogID } });
  }
  async delete(entity: Like): Promise<void> {
    await this.prisma.like.delete({ where: { id: entity.id } });
  }
}
