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

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter((item) => {
      return item.questionId.toString() !== questionId;
    });
  }
}
