import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionComment,
  QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId
) {
  const answer = QuestionComment.create(
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
