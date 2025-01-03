import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

const validationPipe = new ZodValidationPipe(answerQuestionBodySchema);

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(validationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      questionId,
      content,
      authorId: userId,
      attachmentIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }
  }
}
