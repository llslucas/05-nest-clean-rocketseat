import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments use case", () => {
  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch the answer comments.", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("test-answer-id"),
      })
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("test-answer-id"),
      })
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("test-answer-id"),
      })
    );

    const result = await sut.execute({
      answerId: "test-answer-id",
      page: 1,
    });

    const success = result.isRight();
    expect(success).toBe(true);
    if (success) expect(result.value.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginated recent answers comments.", async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("test-answer-id"),
        })
      );
    }

    const result = await sut.execute({
      answerId: "test-answer-id",
      page: 2,
    });

    const success = result.isRight();
    expect(success).toBe(true);
    if (success) expect(result.value.answerComments).toHaveLength(3);
  });
});
