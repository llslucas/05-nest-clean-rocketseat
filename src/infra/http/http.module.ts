import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { CryptografyModule } from "../cryptografy/cryptografy.module";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

@Module({
  imports: [DatabaseModule, CryptografyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
  ],
})
export class HttpModule {}
