import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Comment, CommentProps } from "./comment";

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get answerId() {
    return this.props.answerId;
  }
}
