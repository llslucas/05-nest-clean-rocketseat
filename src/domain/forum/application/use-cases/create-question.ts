import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const newQuestion = Question.create({
      authorId: new UniqueEntityId(authorId),
      title: title,
      content: content,
    });

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: newQuestion.id,
      });
    });

    newQuestion.attachments = new QuestionAttachmentList(questionAttachments);

    const question = await this.repository.create(newQuestion);

    return right({ question });
  }
}

