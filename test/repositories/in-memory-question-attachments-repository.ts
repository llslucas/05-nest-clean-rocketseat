import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const filteredItens = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    return filteredItens;
  }

  async createMany(attachments: QuestionAttachment[]) {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter((item) => {
      return item.questionId.toString() !== questionId;
    });
  }
}
