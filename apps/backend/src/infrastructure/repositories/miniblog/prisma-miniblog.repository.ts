import { injectable, inject } from "inversify";
import type { MiniblogRepository } from "@slice/miniblog/repository";
import type { MiniblogVisibility } from "@slice/miniblog/domain";
import {
  MiniblogContent,
  MiniblogVisibilityVO,
  Miniblog,
  MiniblogVisibilityEnum
} from "@slice/miniblog/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError, IllegalStateError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaMiniblogRepository implements MiniblogRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  private mapToDBVisibility(visibility: MiniblogVisibilityVO): string {
    switch (visibility.value) {
      case MiniblogVisibilityEnum.PUBLIC:
        return "PUBLIC";
      case MiniblogVisibilityEnum.PRIVATE:
        return "PRIVATE";
      case MiniblogVisibilityEnum.HIDDEN:
        return "HIDDEN";
      default:
        return "PUBLIC";
    }
  }

  private mapFromDBVisibility(visibilityStr: string): MiniblogVisibilityVO {
    let vis: MiniblogVisibility;
    switch (visibilityStr) {
      case "PUBLIC":
        vis = MiniblogVisibilityEnum.PUBLIC;
        break;
      case "PRIVATE":
        vis = MiniblogVisibilityEnum.PRIVATE;
        break;
      case "HIDDEN":
      case "FOLLOWERS":
        vis = MiniblogVisibilityEnum.HIDDEN;
        break;
      default:
        vis = MiniblogVisibilityEnum.PUBLIC;
        break;
    }
    return MiniblogVisibilityVO.create(vis);
  }

  async findById(id: ID): Promise<Result<Miniblog, EntityNotFoundError>> {
    const data = await this.prisma.miniblog.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("Miniblog", id) };
    }

    const contentResult = MiniblogContent.create(data.content);
    if (!contentResult.ok) {
      throw new IllegalStateError("Invalid Miniblog data in database");
    }

    const visibilityVO = this.mapFromDBVisibility(data.visibility);

    const miniblog = Miniblog.reconstitute(
      {
        authorID: data.authorID,
        content: contentResult.value,
        visibility: visibilityVO,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      },
      data.id
    );

    return { ok: true, value: miniblog };
  }

  async save(entity: Miniblog): Promise<void> {
    const data = {
      id: entity.id,
      authorID: entity.authorID,
      content: entity.content.value,
      visibility: this.mapToDBVisibility(entity.visibility),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };

    await this.prisma.miniblog.upsert({
      where: { id: entity.id },
      create: data,
      update: data
    });
  }

  async findAllByAuthor(authorID: ID): Promise<Miniblog[]> {
    const rows = await this.prisma.miniblog.findMany({
      where: { authorID },
      orderBy: { createdAt: "desc" }
    });

    return rows.map((data) => {
      const contentResult = MiniblogContent.create(data.content);
      if (!contentResult.ok) {
        throw new IllegalStateError("Invalid Miniblog data in database");
      }

      const visibilityVO = this.mapFromDBVisibility(data.visibility);

      return Miniblog.reconstitute(
        {
          authorID: data.authorID,
          content: contentResult.value,
          visibility: visibilityVO,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      );
    });
  }

  async delete(entity: Miniblog): Promise<void> {
    await this.prisma.miniblog.delete({ where: { id: entity.id } });
  }
}
