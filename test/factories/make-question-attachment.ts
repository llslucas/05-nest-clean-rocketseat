import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const answer = QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id
  );

  return answer;
}
