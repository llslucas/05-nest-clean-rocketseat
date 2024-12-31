import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async findById(answerId: string) {
    return this.items.find((item) => item.id.toString() === answerId) ?? null;
  }

  async findManyByQuestionId(answerId: string, { page }: PaginationParams) {
    const filteredItens = this.items.filter(
      (item) => item.questionId.toString() === answerId
    );

    return filteredItens.slice((page - 1) * 20, page * 20);
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);

    return answer;
  }

  async delete(answerId: string) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answerId
    );

    this.items.splice(index, 1);

    await this.answerAttachmentsRepository.deleteManyByAnswerId(answerId);
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => {
      return item.id === answer.id;
    }); 

    this.items[index] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}

