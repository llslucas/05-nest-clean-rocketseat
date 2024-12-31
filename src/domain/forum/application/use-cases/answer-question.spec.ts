import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer question use case", () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it("should be able to create a new answer", async () => {
    const result = await sut.execute({
      authorId: "author-test",
      questionId: "question-test",
      content: "Testing answer creation.",
      attachmentIds: ["1", "2"],
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const answerOnRepository = inMemoryAnswersRepository.items[0];

      expect(answerOnRepository).toEqual(result.value.answer);
    }
  });
});

