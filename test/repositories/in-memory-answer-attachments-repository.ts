import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const filteredItens = this.items.filter(
      (item) => item.answerId.toString() === answerId
    );

    return filteredItens;
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter((item) => {
      return item.answerId.toString() !== answerId;
    });
  }
}
