import { Entity } from "@/core/entities/entity";

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  create(props: StudentProps): Student {
    return new Student(props);
  }
}
