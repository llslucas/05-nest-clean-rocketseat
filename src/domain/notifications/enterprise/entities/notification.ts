import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
  recipientId: UniqueEntityId;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityId
  ): Notification {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt(): Date | null {
    return this.props.readAt ?? null;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set readAt(readAt: Date) {
    this.props.readAt = readAt;
  }
}
