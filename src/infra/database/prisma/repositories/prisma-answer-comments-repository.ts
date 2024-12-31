import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  findById(answerCommentId: string): Promise<AnswerComment | null> {
    throw new Error("Method not implemented.");
  }

  findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.");
  }

  create(answerComment: AnswerComment): Promise<AnswerComment> {
    throw new Error("Method not implemented.");
  }

  delete(answerCommentId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
