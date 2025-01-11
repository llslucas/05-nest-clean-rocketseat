import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit question use case", () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    );
  });

  it("should be able to edit a question.", async () => {
    const newQuestion = makeQuestion();

    const attachmentsList = new QuestionAttachmentList([
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId("1"),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId("2"),
        questionId: newQuestion.id,
      }),
    ]);

    newQuestion.attachments = attachmentsList;

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: "new test title",
      content: "new test content",
      attachmentIds: ["1", "3"],
    });

    const success = result.isRight();

    expect(success).toBe(true);
    if (success) {
      expect(result.value.question).toEqual(
        inMemoryQuestionsRepository.items[0]
      );
      expect(result.value.question.attachments.getItems()).toHaveLength(2);
      expect(result.value.question.attachments.getItems()).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
      ]);
    }
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion();

    const { id } = await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: id.toString(),
      authorId: "test-author",
      title: "new test title",
      content: "new test content",
      attachmentIds: [],
    });

    const error = result.isLeft();

    expect(error).toBe(true);
    if (error) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it("should sync the attachments with edited question.", async () => {
    const newQuestion = makeQuestion();

    const attachmentsList = new QuestionAttachmentList([
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId("1"),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId("2"),
        questionId: newQuestion.id,
      }),
    ]);

    newQuestion.attachments = attachmentsList;

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: "new test title",
      content: "new test content",
      attachmentIds: ["1", "3"],
    });

    const success = result.isRight();

    expect(success).toBe(true);

    if (success) {
      const attachmentsOnDatabase = inMemoryQuestionAttachmentsRepository.items;
      expect(attachmentsOnDatabase).toHaveLength(2);
      expect(attachmentsOnDatabase).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
      ]);
    }
  });
});

