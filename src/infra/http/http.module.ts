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

@Module({
  imports: [DatabaseModule, CryptografyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
  ],
})
export class HttpModule {}
