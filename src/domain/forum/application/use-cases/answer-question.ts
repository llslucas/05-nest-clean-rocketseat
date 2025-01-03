import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { Either, right } from "@/core/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { Injectable } from "@nestjs/common";

interface AnswerQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
  attachmentIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private repository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const newAnswer = Answer.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content: content,
    });

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: newAnswer.id,
      });
    });

    newAnswer.attachments = new AnswerAttachmentList(answerAttachments);

    const answer = await this.repository.create(newAnswer);

    return right({ answer });
  }
}

