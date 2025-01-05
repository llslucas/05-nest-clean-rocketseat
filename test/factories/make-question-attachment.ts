import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const answer = QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id
  );

  return answer;
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestionAttachment(data?: Partial<QuestionAttachmentProps>) {
    const questionAttachment = makeQuestionAttachment(data);

    await this.prismaService.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    });

    return questionAttachment;
  }
}
