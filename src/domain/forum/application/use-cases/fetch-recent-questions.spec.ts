import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch recent questions use case", () => {
  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to fetch the recent questions.", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 11, 10),
      })
    );

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 11, 22),
      })
    );

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2024, 11, 5),
      })
    );

    const result = await sut.execute({
      page: 1,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.questions).toHaveLength(3);
      expect(result.value.questions[0].createdAt).toEqual(
        new Date(2024, 11, 22)
      );
    }
  });

  it("should be able to fetch paginated recent questions.", async () => {
    for (let i = 0; i < 23; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.questions).toHaveLength(3);
    }
  });
});

