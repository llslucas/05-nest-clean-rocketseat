import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { OnAnswerCreated } from "@/domain/notifications/application/subscribers/on-answer-created";
import { OnQuestionBestAnswerChosen } from "@/domain/notifications/application/subscribers/on-question-best-answer-chosen";
import { SendNotificationUseCase } from "@/domain/notifications/application/use-cases/send-notification";

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
