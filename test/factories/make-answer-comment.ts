import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId
) {
  const answer = AnswerComment.create(
    {
      answerId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  );

  return answer;
}
