import { Student } from "../../enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptografy/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentAlreadyExists =
      await this.studentsRepository.findByEmail(email);

    if (studentAlreadyExists) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const newStudent = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentsRepository.create(newStudent);

    return right({ student: newStudent });
  }
}
