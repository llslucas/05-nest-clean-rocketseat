import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const answer = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    id
  );

  return answer;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAnswerAttachment(data?: Partial<AnswerAttachmentProps>) {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prismaService.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
