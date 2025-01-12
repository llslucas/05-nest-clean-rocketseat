import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { NotificationsRepository } from "@/domain/notifications/application/repositories/notifications-repository";
import { Notification } from "@/domain/notifications/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notification);
  }

  async create(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data,
    });

    return notification;
  }

  async save(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await Promise.all([
      this.prisma.notification.update({
        where: {
          id: notification.id.toString(),
        },
        data,
      }),
    ]);
  }
}
