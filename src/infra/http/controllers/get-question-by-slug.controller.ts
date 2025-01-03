import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

@Controller("questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const question = result.value.question;

    return {
      question: QuestionPresenter.toHTTP(question),
    };
  }
}