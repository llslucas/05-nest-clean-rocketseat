import {
  Uploader,
  UploadParams,
} from "@/domain/forum/application/storage/uploader";
import { randomUUID } from "node:crypto";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  itens: Upload[] = [];

  async upload({ fileName }: UploadParams) {
    const url = randomUUID();

    const upload = {
      fileName,
      url,
    };

    this.itens.push(upload);

    return upload;
  }
}
