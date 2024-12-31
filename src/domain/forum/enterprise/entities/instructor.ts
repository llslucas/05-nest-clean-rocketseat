import { Entity } from "@/core/entities/entity";

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps): Instructor {
    return new Instructor(props);
  }

  get name() {
    return this.props.name;
  }
}

