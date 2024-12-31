import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptografy/fake-hasher";
import { FakeEncrypter } from "test/cryptografy/fake-encrypter";
import { makeStudent } from "test/factories/make-student";
import { AuthenticateStudentUseCase } from "./authenticate-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let hashGenerator: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    hashGenerator = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      hashGenerator,
      encrypter
    );
  });

  it("should be able to register a new student", async () => {
    const student = makeStudent({
      email: "teste@email.com",
      password: await hashGenerator.hash("123456"),
    });

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: "teste@email.com",
      password: "123456",
    });

    const success = result.isRight();
    expect(success).toBe(true);

    if (success) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      });
    }
  });
});
