import { Either, left, right } from "@/core/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string;
  authorId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteQuestionCommentUseCase {
  constructor(private repository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.repository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(questionCommentId);

    return right(null);
  }
}
