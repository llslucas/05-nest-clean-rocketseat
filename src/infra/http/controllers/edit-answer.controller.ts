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
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

const validationPipe = new ZodValidationPipe(editAnswerBodySchema);

export type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:answerId")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(validationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("answerId") answerId: string
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentIds: [],
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }
  }
}
