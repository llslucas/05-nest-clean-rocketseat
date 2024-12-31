import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Comment, CommentProps } from "./comment";

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get questionId() {
    return this.props.questionId;
  }
}

