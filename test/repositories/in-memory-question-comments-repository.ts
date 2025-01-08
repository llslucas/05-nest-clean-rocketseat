import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const filteredItens = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    return filteredItens.slice((page - 1) * 20, page * 20).map((comment) => {
      const author = this.inMemoryStudentsRepository.items.find((author) => {
        return author.id === comment.authorId;
      });

      if (!author) {
        throw new Error(`Author with ID "${comment.authorId}" does not exist.`);
      }

      return CommentWithAuthor.create({
        commentId: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt ?? null,
        authorId: comment.authorId,
        author: author.name,
      });
    });
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

