import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
  commentId: UniqueEntityId;
  content: string;
  authorId: UniqueEntityId;
  author: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props);
  }

  get commentId(): UniqueEntityId {
    return this.props.commentId;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get author(): string {
    return this.props.author;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }
}
