import { describe, it, expect } from "vitest";
import { Notification, NotificationType } from "../../domain/notification.entity.ts";
import { NotificationCreatedEvent } from "../../events/notification-created.event.ts";
import { NotificationReadEvent } from "../../events/notification-read.event.ts";

describe("Notification Entity", () => {
  const createNotification = () => {
    return Notification.create({
      userID: "user-123",
      actorID: "actor-456",
      type: NotificationType.LIKE,
      referenceID: "like-789"
    });
  };

  it("should create a notification and emit NotificationCreatedEvent", () => {
    const notification = createNotification();

    expect(notification.userID).toBe("user-123");
    expect(notification.actorID).toBe("actor-456");
    expect(notification.type).toBe(NotificationType.LIKE);
    expect(notification.referenceID).toBe("like-789");
    expect(notification.isRead).toBe(false);
    expect(notification.id).toBeDefined();

    const events = notification.getAndClearEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(NotificationCreatedEvent);

    const event = events[0] as NotificationCreatedEvent;
    expect(event.userID).toBe("user-123");
    expect(event.actorID).toBe("actor-456");
    expect(event.type).toBe(NotificationType.LIKE);
    expect(event.referenceID).toBe("like-789");
  });

  it("should mark as read and emit NotificationReadEvent", () => {
    const notification = createNotification();

    notification.markAsRead();

    expect(notification.isRead).toBe(true);

    const events = notification.getAndClearEvents;
    expect(events).toHaveLength(2);
    expect(events[1]).toBeInstanceOf(NotificationReadEvent);

    const event = events[1] as NotificationReadEvent;
    expect(event.userID).toBe("user-123");
  });
});
