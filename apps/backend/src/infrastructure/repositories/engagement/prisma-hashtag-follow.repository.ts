import { injectable, inject } from "inversify";
import type { HashtagFollowRepository } from "@slice/engagement/repository";
import { HashtagFollow, HashtagVO } from "@slice/engagement/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError, IllegalStateError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaHashtagFollowRepository implements HashtagFollowRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findById(id: ID): Promise<Result<HashtagFollow, EntityNotFoundError>> {
    const data = await this.prisma.hashtagFollow.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("HashtagFollow", id) };
    }
    const hashtagResult = HashtagVO.create(data.hashtag);
    if (!hashtagResult.ok) {
      throw new IllegalStateError("Invalid hashtag in database");
    }
    return {
      ok: true,
      value: HashtagFollow.reconstitute(
        {
          userID: data.userID,
          hashtag: hashtagResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    };
  }

  async save(entity: HashtagFollow): Promise<void> {
    await this.prisma.hashtagFollow.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        userID: entity.userID,
        hashtag: entity.hashtag.value,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: { createdAt: entity.createdAt, updatedAt: entity.updatedAt }
    });
  }

  async findByUser(userID: ID): Promise<HashtagFollow[]> {
    const rows = await this.prisma.hashtagFollow.findMany({
      where: { userID },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) => {
      const hashtagResult = HashtagVO.create(data.hashtag);
      if (!hashtagResult.ok) {
        throw new IllegalStateError("Invalid hashtag in database");
      }
      return HashtagFollow.reconstitute(
        {
          userID: data.userID,
          hashtag: hashtagResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      );
    });
  }

  async findByHashtag(hashtag: string): Promise<HashtagFollow[]> {
    const rows = await this.prisma.hashtagFollow.findMany({
      where: { hashtag },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) => {
      const hashtagResult = HashtagVO.create(data.hashtag);
      if (!hashtagResult.ok) {
        throw new IllegalStateError("Invalid hashtag in database");
      }
      return HashtagFollow.reconstitute(
        {
          userID: data.userID,
          hashtag: hashtagResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      );
    });
  }

  async deleteByUserAndHashtag(userID: ID, hashtag: string): Promise<void> {
    await this.prisma.hashtagFollow.deleteMany({ where: { userID, hashtag } });
  }
  async delete(entity: HashtagFollow): Promise<void> {
    await this.prisma.hashtagFollow.delete({ where: { id: entity.id } });
  }
}
