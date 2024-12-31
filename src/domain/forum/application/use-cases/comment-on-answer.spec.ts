import { makeAnswer } from "test/factories/make-answer";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe("AnswerComment answer use case", () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    );
  });

  it("should be able to create a new answer comment", async () => {
    const answer = makeAnswer();
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      authorId: "author-test",
      answerId: answer.id.toString(),
      content: "Testing answer comment creation.",
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.answerComment).toEqual(
        inMemoryAnswerCommentsRepository.items[0]
      );
    }
  });
});
