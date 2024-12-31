import { faker } from "@faker-js/faker";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId
) {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return answer;
}

