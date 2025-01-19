import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "@/domain/notifications/enterprise/entities/notification";
import { Injectable } from "@nestjs/common";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id
  );

  return notification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaNotification(
    data?: Partial<NotificationProps>,
    id?: UniqueEntityId
  ) {
    const notification = makeNotification(data, id);

    await this.prismaService.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
