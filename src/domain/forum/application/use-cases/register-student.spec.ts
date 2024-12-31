import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { RegisterStudentUseCase } from "./register-student";
import { FakeHasher } from "test/cryptografy/fake-hasher";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let hashGenerator: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    hashGenerator = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, hashGenerator);
  });

  it("should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "Teste",
      email: "teste@email.com",
      password: "123456",
    });

    const success = result.isRight();
    expect(success).toBe(true);

    if (success) {
      const repositoryStudent = inMemoryStudentsRepository.items[0];
      expect(repositoryStudent).toEqual(result.value.student);
    }
  });

  it("should hash the password upon registration", async () => {
    const result = await sut.execute({
      name: "Teste",
      email: "teste@email.com",
      password: "123456",
    });

    const hashedPassword = await hashGenerator.hash("123456");

    const success = result.isRight();
    expect(success).toBe(true);

    if (success) {
      const repositoryStudent = inMemoryStudentsRepository.items[0];
      expect(repositoryStudent.password).toEqual(hashedPassword);
    }
  });
});
