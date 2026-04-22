import { injectable, inject } from "inversify";
import type { UserRepository } from "@slice/identity/repository";
import { User, DisplayName, Bio } from "@slice/identity/domain";
import type { Nickname } from "@slice/identity/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError, IllegalStateError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaUserRepository implements UserRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findByNickname(nickname: Nickname): Promise<Result<User, EntityNotFoundError>> {
    const account = await this.prisma.account.findUnique({
      where: { nickname: nickname.value },
      include: { user: true }
    });

    if (!account || !account.user) {
      return { ok: false, error: new EntityNotFoundError("User", nickname.value) };
    }

    return this.findById(account.user.id);
  }

  async findById(id: ID): Promise<Result<User, EntityNotFoundError>> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("User", id) };
    }

    const displayNameResult = DisplayName.create(data.displayName);
    const bioResult = Bio.create(data.bio);

    if (!displayNameResult.ok || !bioResult.ok) {
      throw new IllegalStateError("Invalid DisplayName or Bio in database");
    }

    const user = User.reconstitute(
      {
        accountID: data.accountID,
        displayName: displayNameResult.value,
        bio: bioResult.value,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      },
      data.id
    );

    return { ok: true, value: user };
  }

  async save(entity: User): Promise<void> {
    const data = {
      id: entity.id,
      accountID: entity.accountID,
      displayName: entity.displayName.value,
      bio: entity.bio.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };

    await this.prisma.user.upsert({
      where: { id: entity.id },
      create: data,
      update: data
    });
  }

  async delete(entity: User): Promise<void> {
    await this.prisma.user.delete({ where: { id: entity.id } });
  }
}
