import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityId): Attachment {
    return new Attachment(props, id);
  }

  get title() {
    return this._props.title;
  }

  get url() {
    return this._props.url;
  }
}
