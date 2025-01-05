import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(questionId: string) {
    return this.items.find((item) => item.id.toString() === questionId) ?? null;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    this.items.sort((a, b) => {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    });

    return this.items.slice((page - 1) * 20, page * 20);
  }

  async create(question: Question) {
    this.items.push(question);

    this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);

    return question;
  }

  async delete(questionId: string) {
    const index = this.items.findIndex((item) => {
      return item.id.toString() === questionId;
    });

    this.items.splice(index, 1);

    await this.questionAttachmentsRepository.deleteManyByQuestionId(questionId);
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => {
      return item.id === question.id;
    });

    this.items[index] = question;

    this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems()
    );

    this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}

