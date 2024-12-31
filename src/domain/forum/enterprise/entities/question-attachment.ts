import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Entity } from "@/core/entities/entity";

export interface QuestionAttachmentProps {
  questionId: UniqueEntityId;
  attachmentId: UniqueEntityId;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
    return new QuestionAttachment(props, id);
  }

  get questionId() {
    return this._props.questionId;
  }

  get attachmentId() {
    return this._props.attachmentId;
  }
}
