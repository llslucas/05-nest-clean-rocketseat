import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  AttachmentProps,
} from "@/domain/forum/enterprise/entities/attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.sentence(4),
      url: `${randomUUID()}-${faker.lorem.word()}.jpg`,
      ...override,
    },
    id
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAttachment(data?: Partial<AttachmentProps>) {
    const attachment = makeAttachment(data);

    await this.prismaService.attachment.create({
      data: {
        id: attachment.id.toString(),
        title: attachment.title,
        url: attachment.url,
      },
    });

    return attachment;
  }
}
