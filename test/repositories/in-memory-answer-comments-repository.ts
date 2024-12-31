import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async findById(answerCommentId: string) {
    return (
      this.items.find((item) => item.id.toString() === answerCommentId) ??
      null
    );
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const filteredItens = this.items.filter(
      (item) => item.answerId.toString() === answerId
    );

    return filteredItens.slice((page - 1) * 20, page * 20);
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);

    return answerComment;
  }

  async delete(answerCommentId: string) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answerCommentId
    );

    this.items.splice(index, 1);
  }
}

