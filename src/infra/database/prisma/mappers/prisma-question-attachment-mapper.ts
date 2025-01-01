import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaQuestionAttachment } from "@prisma/client";

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
}
