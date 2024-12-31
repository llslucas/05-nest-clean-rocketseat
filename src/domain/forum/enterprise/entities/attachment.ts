import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AttachmentProps {
  title: UniqueEntityId;
  link: string;
}

export abstract class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this._props.title;
  }

  get link() {
    return this._props.link;
  }
}
