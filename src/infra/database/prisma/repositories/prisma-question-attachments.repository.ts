import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const questions = await this.prismaService.attachment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        title: "asc",
      },
    });

    return questions.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prismaService.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]) {
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

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
