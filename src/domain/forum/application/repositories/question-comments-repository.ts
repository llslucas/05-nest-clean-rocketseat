import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentsRepository {
  abstract findById(questionCommentId: string): Promise<QuestionComment | null>;

  abstract findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]>;

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]>;

  abstract create(questionComment: QuestionComment): Promise<QuestionComment>;
  abstract delete(questionCommentId: string): Promise<void>;
}

