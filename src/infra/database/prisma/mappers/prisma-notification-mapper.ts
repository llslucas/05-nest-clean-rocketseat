import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notifications/enterprise/entities/notification";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(
    notification: Notification
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
