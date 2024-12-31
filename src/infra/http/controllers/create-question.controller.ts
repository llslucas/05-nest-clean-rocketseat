import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const validationPipe = new ZodValidationPipe(createQuestionBodySchema);

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(validationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const question = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentIds: [],
    });

    return { question };
  }
}
