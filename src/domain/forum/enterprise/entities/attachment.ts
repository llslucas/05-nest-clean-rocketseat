import { Entity } from "@/core/entities/entity";

export interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps): Attachment {
    return new Attachment(props);
  }

  get title() {
    return this._props.title;
  }

  get url() {
    return this._props.url;
  }
}
