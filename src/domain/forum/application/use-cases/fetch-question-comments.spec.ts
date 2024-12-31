import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments use case", () => {
  beforeEach(async () => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch the question comments.", async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("test-question-id"),
      })
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("test-question-id"),
      })
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("test-question-id"),
      })
    );

    const result = await sut.execute({
      questionId: "test-question-id",
      page: 1,
    });

    const success = result.isRight();
    expect(success).toBe(true);
    if (success) expect(result.value.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginated recent questions comments.", async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
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
    if (success) expect(result.value.questionComments).toHaveLength(3);
  });
});
