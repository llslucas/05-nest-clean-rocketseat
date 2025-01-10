import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

  public items: AnswerComment[] = [];

  async findById(answerCommentId: string) {
    return (
      this.items.find((item) => item.id.toString() === answerCommentId) ?? null
    );
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const filteredItens = this.items.filter(
      (item) => item.answerId.toString() === answerId
    );

    return filteredItens.slice((page - 1) * 20, page * 20);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams
  ) {
    const filteredItens = this.items.filter(
      (item) => item.answerId.toString() === answerId
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
