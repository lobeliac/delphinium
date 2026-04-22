import { injectable, inject } from "inversify";
import type { AccountRepository } from "@slice/identity/repository";
import { Account, Nickname, Password } from "@slice/identity/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaAccountRepository implements AccountRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findById(id: ID): Promise<Result<Account, EntityNotFoundError>> {
    const data = await this.prisma.account.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("Account", id) };
    }

    const nickname = Nickname.reconstitute(data.nickname);
    const password = Password.reconstitute(data.passwordHash);

    const account = Account.reconstitute(
      {
        nickname,
        password,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      },
      data.id
    );

    return { ok: true, value: account };
  }

  async save(entity: Account): Promise<void> {
    const data = {
      id: entity.id,
      nickname: entity.nickname.value,
      passwordHash: entity.password.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };

    await this.prisma.account.upsert({
      where: { id: entity.id },
      create: data,
      update: data
    });
  }

  async delete(entity: Account): Promise<void> {
    await this.prisma.account.delete({ where: { id: entity.id } });
  }
}
