import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments use case", () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch the answer comments.", async () => {
    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    const newComments = await Promise.all([
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("test-answer-id"),
          authorId: student.id,
        })
      ),
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("test-answer-id"),
          authorId: student.id,
        })
      ),
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("test-answer-id"),
          authorId: student.id,
        })
      ),
    ]);

    const result = await sut.execute({
      answerId: "test-answer-id",
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

  it("should be able to fetch paginated recent answers comments.", async () => {
    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    for (let i = 0; i < 23; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("test-answer-id"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      answerId: "test-answer-id",
      page: 2,
    });

    const success = result.isRight();
    expect(success).toBe(true);

    if (success) {
      expect(result.value.comments).toHaveLength(3);
    }
  });
});
