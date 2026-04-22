import { injectable, inject } from "inversify";
import type { NotificationRepository } from "@slice/engagement/repository";
import type { NotificationType } from "@slice/engagement/domain";
import { Notification } from "@slice/engagement/domain";
import { PrismaService } from "../../database/prisma.ts";
import { EntityNotFoundError } from "@base/domain/error";
import type { Result } from "@base/domain/result";
import type { ID } from "@base/domain/entity.base";

@injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  private readonly prisma: PrismaService;

  constructor(@inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async findById(id: ID): Promise<Result<Notification, EntityNotFoundError>> {
    const data = await this.prisma.notification.findUnique({ where: { id } });
    if (!data) {
      return { ok: false, error: new EntityNotFoundError("Notification", id) };
    }
    return {
      ok: true,
      value: Notification.reconstitute(
        {
          userID: data.userID,
          actorID: data.actorID,
          type: data.type as NotificationType,
          referenceID: data.referenceID,
          isRead: data.isRead,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    };
  }

  async save(entity: Notification): Promise<void> {
    await this.prisma.notification.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        userID: entity.userID,
        actorID: entity.actorID,
        type: entity.type,
        referenceID: entity.referenceID,
        isRead: entity.isRead,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: { isRead: entity.isRead, updatedAt: entity.updatedAt }
    });
  }

  async findByUser(userID: ID): Promise<Notification[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userID },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) =>
      Notification.reconstitute(
        {
          userID: data.userID,
          actorID: data.actorID,
          type: data.type as NotificationType,
          referenceID: data.referenceID,
          isRead: data.isRead,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    );
  }

  async findUnreadByUser(userID: ID): Promise<Notification[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userID, isRead: false },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((data) =>
      Notification.reconstitute(
        {
          userID: data.userID,
          actorID: data.actorID,
          type: data.type as NotificationType,
          referenceID: data.referenceID,
          isRead: data.isRead,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        },
        data.id
      )
    );
  }

  async markAllAsRead(userID: ID): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userID, isRead: false },
      data: { isRead: true, updatedAt: new Date() }
    });
  }
  async delete(entity: Notification): Promise<void> {
    await this.prisma.notification.delete({ where: { id: entity.id } });
  }
}
