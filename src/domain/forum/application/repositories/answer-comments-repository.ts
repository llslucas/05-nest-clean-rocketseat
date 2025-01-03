import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export abstract class AnswerCommentsRepository {
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]>;
  abstract create(answerComment: AnswerComment): Promise<AnswerComment>;
  abstract delete(answerCommentId: string): Promise<void>;
}
