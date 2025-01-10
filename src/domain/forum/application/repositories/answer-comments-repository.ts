import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class AnswerCommentsRepository {
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>;

  abstract findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]>;

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]>;

  abstract create(answerComment: AnswerComment): Promise<AnswerComment>;
  abstract delete(answerCommentId: string): Promise<void>;
}
