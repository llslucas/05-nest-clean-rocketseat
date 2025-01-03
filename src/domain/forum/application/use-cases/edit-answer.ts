import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { Injectable } from "@nestjs/common";

interface EditAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
  attachmentIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(
        answer.id.toString()
      );

    const newAnswerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments
    );

    answerAttachmentList.update(newAnswerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answersRepository.save(answer);

    return right({ answer });
  }
}

