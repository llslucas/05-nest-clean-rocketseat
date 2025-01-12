import { Notification } from "../../enterprise/entities/notification";

export abstract class NotificationsRepository {
  abstract findById(notificationId: string): Promise<Notification | null>;
  abstract create(notification: Notification): Promise<Notification>;
  abstract save(notification: Notification): Promise<void>;
}
