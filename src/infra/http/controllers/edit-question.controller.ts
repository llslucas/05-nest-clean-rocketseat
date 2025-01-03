import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const validationPipe = new ZodValidationPipe(editQuestionBodySchema);

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:questionId")
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(validationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentIds: [],
      questionId,
    });

    console.log(result);

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }
  }
}
