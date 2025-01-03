import { faker } from "@faker-js/faker";
import {
  Student,
  StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-student-mapper";

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaStudent(data?: Partial<StudentProps>) {
    const student = makeStudent(data);

    await this.prismaService.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
