import { Either, left, right } from "@/core/either";
import { AnswersRepository } from "../repositories/answers-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>;

export class DeleteAnswerUseCase {
  constructor(private repository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.repository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(answerId);

    return right({});
  }
}

