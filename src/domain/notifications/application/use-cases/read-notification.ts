import { NotificationsRepository } from "../repositories/notifications-repository";
import { Notification } from "../../enterprise/entities/notification";
import { Either, right, left } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.readAt = new Date();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
