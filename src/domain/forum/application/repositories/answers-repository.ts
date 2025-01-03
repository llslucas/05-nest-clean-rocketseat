import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export abstract class AnswersRepository {
  abstract findById(answerId: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]>;
  abstract create(answer: Answer): Promise<Answer>;
  abstract delete(answerId: string): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
}

