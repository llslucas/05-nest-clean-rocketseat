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
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

const validationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

export type CommentOnQuestionBodySchema = z.infer<
  typeof commentOnQuestionBodySchema
>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(validationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      questionId,
      content,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }
  }
}
