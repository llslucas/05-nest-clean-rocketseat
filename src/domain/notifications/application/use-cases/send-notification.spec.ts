import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";

describe("Send Notification", () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
  let sut: SendNotificationUseCase;

  beforeEach(async () => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "test-title",
      content: "test content",
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.notification).toEqual(
        inMemoryNotificationsRepository.items[0]
      );
    }
  });
});
