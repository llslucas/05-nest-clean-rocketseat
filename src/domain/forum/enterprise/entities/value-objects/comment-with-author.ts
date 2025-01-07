import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
  commentId: string;
  content: string;
  authorId: string;
  author: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props);
  }

  get commentId(): string {
    return this.props.commentId;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
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
