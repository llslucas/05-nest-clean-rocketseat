import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Prisma, Attachment as PrismaQuestionAttachment } from "@prisma/client";
export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaQuestionAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error("Invalid Attachment type.");
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString()
    );

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    };
  }
}
