import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  constructor() {}

  async findByEmail(email: string) {
    return this.items.find((item) => item.email === email) ?? null;
  }

  async create(student: Student) {
    this.items.push(student);
  }
}