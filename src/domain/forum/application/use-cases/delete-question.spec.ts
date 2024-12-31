import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete question use case", () => {
  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to delete a question.", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("test-author"),
    });

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId("1"),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId("2"),
        questionId: newQuestion.id,
      })
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: "test-author",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("test-author-1"),
    });

    const question = await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: "test-author-2",
    });

    const error = result.isLeft();

    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });
});

