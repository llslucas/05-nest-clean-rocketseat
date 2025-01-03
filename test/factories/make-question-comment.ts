import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionComment,
  QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  const answer = QuestionComment.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return answer;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestionComment(data?: Partial<QuestionCommentProps>) {
    const questionComment = makeQuestionComment(data);

    await this.prismaService.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    });

    return questionComment;
  }
}
