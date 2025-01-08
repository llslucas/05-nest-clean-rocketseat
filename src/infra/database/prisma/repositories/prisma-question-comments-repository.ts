import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment = await this.prismaService.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prismaService.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const questionComments = await this.prismaService.comment.findMany({
      where: {
        questionId,
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

  async create(questionComment: QuestionComment): Promise<QuestionComment> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prismaService.comment.create({
      data,
    });

    return questionComment;
  }

  async delete(questionCommentId: string): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: questionCommentId,
      },
    });
  }
}
