import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository
  ) {}

  async findById(questionId: string) {
    return this.items.find((item) => item.id.toString() === questionId) ?? null;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null;
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question =
      this.items.find((item) => item.slug.value === slug) ?? null;

    if (!question) {
      return null;
    }

    const student = this.studentsRepository.items.find(
      (student) => student.id === question.authorId
    );

    if (!student) {
      throw new Error(
        `A student with id ${question.authorId.toString()} does not exists`
      );
    }

    const attachments = question.attachments
      .getItems()
      .map((questionAttachment) => {
        const attachment = this.attachmentsRepository.items.find(
          (attachment) => {
            return attachment.id.equals(questionAttachment.attachmentId);
          }
        );

        if (!attachment) {
          throw new Error(
            `An attachment with ID ${questionAttachment.attachmentId.toString()} does not exists.`
          );
        }

        return attachment;
      });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: student.id,
      author: student.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
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

