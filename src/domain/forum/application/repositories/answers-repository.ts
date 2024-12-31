import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
  findById(answerId: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]>;
  create(answer: Answer): Promise<Answer>;
  delete(answerId: string): Promise<void>;
  save(answer: Answer): Promise<void>;
}

