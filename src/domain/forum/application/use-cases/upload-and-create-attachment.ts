import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidFileTypeError } from "./errors/invalid-file-type-error";
import { Attachment } from "../../enterprise/entities/attachment";
import { Uploader } from "../storage/uploader";
import { AttachmentsRepository } from "../repositories/attachments-repository";

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidFileTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const fileTypeIsValid = /^(image\/jpeg|image\/png|application\/pdf)$/.test(
      fileType
    );

    if (!fileTypeIsValid) {
      return left(new InvalidFileTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
