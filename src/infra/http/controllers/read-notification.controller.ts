import { ReadNotificationUseCase } from "@/domain/notifications/application/use-cases/read-notification";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";

@Controller("notifications/:notificationId/read")
export class ReadNotificationController {
  constructor(private readNotificationUseCase: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("notificationId") notificationId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.readNotificationUseCase.execute({
      recipientId: user.sub,
      notificationId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
