import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionCommentsRepository {
  findById(questionCommentId: string): Promise<QuestionComment | null>;
  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]>;
  create(questionComment: QuestionComment): Promise<QuestionComment>;
  delete(questionCommentId: string): Promise<void>;
}

