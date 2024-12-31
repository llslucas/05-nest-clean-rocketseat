import { NotificationsRepository } from "@/domain/notifications/application/repositories/notifications-repository";
import { Notification } from "@/domain/notifications/enterprise/entities/notification";

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  constructor() {}

  async findById(notificationId: string) {
    return (
      this.items.find((item) => item.id.toString() === notificationId) ?? null
    );
  }

  async create(notification: Notification) {
    this.items.push(notification);

    return notification;
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => {
      return item.id === notification.id;
    });

    this.items[index] = notification;
  }
}
