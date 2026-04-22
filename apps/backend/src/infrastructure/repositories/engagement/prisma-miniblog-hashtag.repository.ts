import { injectable, inject } from "inversify";
import type { MiniblogHashtagRepository } from "@slice/engagement/repository";
import { MiniblogHashtag, HashtagVO } from "@slice/engagement/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError, IllegalStateError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaMiniblogHashtagRepository implements MiniblogHashtagRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findById(id: ID): Promise<Result<MiniblogHashtag, EntityNotFoundError>> {
    const data = await this.prisma.miniblogHashtag.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("MiniblogHashtag", id) };
    }
    const hashtagResult = HashtagVO.create(data.hashtag);
    if (!hashtagResult.ok) {
      throw new IllegalStateError("Invalid hashtag in database");
    }
    return {
      ok: true,
      value: MiniblogHashtag.reconstitute(
        {
          miniblogID: data.miniblogID,
          hashtag: hashtagResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    };
  }

  async save(entity: MiniblogHashtag): Promise<void> {
    await this.prisma.miniblogHashtag.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        miniblogID: entity.miniblogID,
        hashtag: entity.hashtag.value,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: { createdAt: entity.createdAt, updatedAt: entity.updatedAt }
    });
  }

  async findByMiniblog(miniblogID: ID): Promise<MiniblogHashtag[]> {
    const rows = await this.prisma.miniblogHashtag.findMany({
      where: { miniblogID },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) => {
      const hashtagResult = HashtagVO.create(data.hashtag);
      if (!hashtagResult.ok) {
        throw new IllegalStateError("Invalid hashtag in database");
      }
      return MiniblogHashtag.reconstitute(
        {
          miniblogID: data.miniblogID,
          hashtag: hashtagResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      );
    });
  }

  async findByHashtag(hashtag: string): Promise<MiniblogHashtag[]> {
    const rows = await this.prisma.miniblogHashtag.findMany({
      where: { hashtag },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) => {
      const hashtagResult = HashtagVO.create(data.hashtag);
      if (!hashtagResult.ok) {
        throw new IllegalStateError("Invalid hashtag in database");
      }
      return MiniblogHashtag.reconstitute(
        {
          miniblogID: data.miniblogID,
          hashtag: hashtagResult.value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      );
    });
  }

  async deleteByMiniblogAndHashtag(miniblogID: ID, hashtag: string): Promise<void> {
    await this.prisma.miniblogHashtag.deleteMany({ where: { miniblogID, hashtag } });
  }
  async delete(entity: MiniblogHashtag): Promise<void> {
    await this.prisma.miniblogHashtag.delete({ where: { id: entity.id } });
  }
}
