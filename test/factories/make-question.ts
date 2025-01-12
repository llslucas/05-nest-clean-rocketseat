import { faker } from "@faker-js/faker";
import {
  Question,
  QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestion(data?: Partial<QuestionProps>, id?: UniqueEntityId) {
    const question = makeQuestion(data, id);

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}

