import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }

  static toDomain(attachment: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: attachment.title,
        url: attachment.url,
      },
      new UniqueEntityId(attachment.id)
    );
  }
}
