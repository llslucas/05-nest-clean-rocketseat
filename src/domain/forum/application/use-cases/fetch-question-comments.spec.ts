import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments use case", () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch the question comments.", async () => {
    const student = makeStudent();

    inMemoryStudentsRepository.items.push(student);

    const newComments = await Promise.all([
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityId("test-question-id"),
        })
      ),
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityId("test-question-id"),
        })
      ),
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityId("test-question-id"),
        })
      ),
    ]);

    const result = await sut.execute({
      questionId: "test-question-id",
      page: 1,
    });

    const success = result.isRight();
    expect(success).toBe(true);

    if (success) {
      expect(result.value.comments).toHaveLength(3);
      expect(result.value.comments).toEqual([
        expect.objectContaining({
          authorId: student.id,
          commentId: newComments[0].id,
        }),
        expect.objectContaining({
          authorId: student.id,
          commentId: newComments[1].id,
        }),
        expect.objectContaining({
          authorId: student.id,
          commentId: newComments[2].id,
        }),
      ]);
    }
  });

  it("should be able to fetch paginated recent questions comments.", async () => {
    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    for (let i = 0; i < 23; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("test-question-id"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      questionId: "test-question-id",
      page: 2,
    });

    const success = result.isRight();
    expect(success).toBe(true);
    if (success) expect(result.value.comments).toHaveLength(3);
  });
});
