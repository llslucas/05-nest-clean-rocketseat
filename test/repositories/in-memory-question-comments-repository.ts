import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  async findById(questionCommentId: string) {
    return (
      this.items.find((item) => item.id.toString() === questionCommentId) ??
      null
    );
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const filteredItens = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    return filteredItens.slice((page - 1) * 20, page * 20);
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    return questionComment;
  }

  async delete(questionCommentId: string) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === questionCommentId
    );

    this.items.splice(index, 1);
  }
}

