import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get question by slug use case", () => {
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
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by the slug.", async () => {
    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    const newQuestion = makeQuestion({
      slug: Slug.create("question-test"),
      authorId: student.id,
    });

    const attachment = makeAttachment();
    inMemoryAttachmentsRepository.items.push(attachment);

    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    });

    inMemoryQuestionAttachmentsRepository.items.push(questionAttachment);

    newQuestion.attachments.update([questionAttachment]);

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "question-test",
    });

    const success = result.isRight();

    if (success) {
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          questionId: newQuestion.id,
          authorId: student.id,
          attachments: expect.arrayContaining([attachment]),
        }),
      });
    }
  });
});

