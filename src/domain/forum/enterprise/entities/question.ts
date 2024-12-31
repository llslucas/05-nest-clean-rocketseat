import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "./value-objects/slug";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | null;
  title: string;
  content: string;
  slug: Slug;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityId
  ): Question {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId(): UniqueEntityId | null {
    return this.props.bestAnswerId ?? null;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get attachments() {
    return this._props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt;
  }

  get isNew() {
    return dayjs(new Date()).diff(this.createdAt) <= 3;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
    if (!bestAnswerId) {
      return;
    }

    if (
      !this.props.bestAnswerId ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId)
      );
    }

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
    this.touch();
  }
}

