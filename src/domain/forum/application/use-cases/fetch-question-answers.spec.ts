import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch question answers use case", () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it("should be able to fetch the question answers.", async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId("test-question-id"),
      })
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId("test-question-id"),
      })
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId("test-question-id"),
      })
    );

    const result = await sut.execute({
      questionId: "test-question-id",
      page: 1,
    });

    const success = result.isRight();
    expect(success).toBe(true);
    if (success) expect(result.value.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated recent questions.", async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("test-question-id"),
        })
      );
    }

    const result = await sut.execute({
      questionId: "test-question-id",
      page: 2,
    });

    const success = result.isRight();
    expect(success).toBe(true);
    if (success) expect(result.value.answers).toHaveLength(3);
  });
});

