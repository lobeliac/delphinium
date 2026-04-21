import type { Repository } from "@base/domain/repository.base";
import type { ID } from "@base/domain/entity.base";
import type { Notification } from "../domain/notification.entity.ts";

export type NotificationRepository = {
  /**
   * Retrieves all notifications for a specific user.
   * @param userID - The unique identifier of the user.
   */
  findByUser(userID: ID): Promise<Notification[]>;

  /**
   * Retrieves unread notifications for a specific user.
   * @param userID - The unique identifier of the user.
   */
  findUnreadByUser(userID: ID): Promise<Notification[]>;

  /**
   * Marks all unread notifications as read for a specific user.
   * @param userID - The unique identifier of the user.
   */
  markAllAsRead(userID: ID): Promise<void>;
} & Repository<Notification>;
