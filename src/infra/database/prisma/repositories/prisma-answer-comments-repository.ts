import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment = await this.prismaService.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prismaService.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const questionComments = await this.prismaService.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<AnswerComment> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prismaService.comment.create({
      data,
    });

    return answerComment;
  }

  async delete(answerCommentId: string): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: answerCommentId,
      },
    });
  }
}
