import { makeQuestion } from "test/factories/make-question";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("QuestionComment question use case", () => {
  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it("should be able to create a new question comment", async () => {
    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      authorId: "author-test",
      questionId: question.id.toString(),
      content: "Testing question comment creation.",
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      expect(result.value.questionComment).toEqual(
        inMemoryQuestionCommentsRepository.items[0]
      );
    }
  });
});

