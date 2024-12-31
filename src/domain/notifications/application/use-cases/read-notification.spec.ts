import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "test/factories/make-notification";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

describe("Read Notification", () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
  let sut: ReadNotificationUseCase;

  beforeEach(async () => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to read a notification", async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.notification).toEqual(
        inMemoryNotificationsRepository.items[0]
      );
      expect(result.value.notification.readAt).toEqual(expect.any(Date));
    }
  });

  it("should not be able to read a notification from another recipient.", async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: "fake-user",
      notificationId: notification.id.toString(),
    });

    const error = result.isLeft();

    expect(error).toBe(true);
    if (error) expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
