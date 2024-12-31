import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete answer use case", () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer.", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId("test-author"),
    });

    const answer = await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "test-author",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId("test-author-1"),
    });

    const answer = await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "test-author-2",
    });

    const error = result.isLeft();

    expect(error).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

