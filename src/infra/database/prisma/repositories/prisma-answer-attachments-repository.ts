import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answers = await this.prismaService.attachment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        title: "asc",
      },
    });

    return answers.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async createMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prismaService.attachment.updateMany(data);
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const attachmentIds = attachments.map((attachment) =>
      attachment.attachmentId.toString()
    );

    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }
}
