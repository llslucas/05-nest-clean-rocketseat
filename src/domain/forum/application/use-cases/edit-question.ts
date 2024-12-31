import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(
        question.id.toString()
      );

    const newQuestionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments
    );

    questionAttachmentList.update(newQuestionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}

