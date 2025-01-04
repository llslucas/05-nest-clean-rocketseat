import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidFileTypeError } from "./errors/invalid-file-type-error";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create Attachment", () => {
  beforeEach(async () => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    );
  });

  it("should be able to register a new attachment", async () => {
    const result = await sut.execute({
      fileName: "image.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    const success = result.isRight();
    expect(success).toBe(true);

    if (success) {
      const repositoryAttachment = inMemoryAttachmentsRepository.items[0];
      expect(repositoryAttachment).toEqual(result.value.attachment);
    }
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "image.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    const error = result.isLeft();
    expect(error).toBe(true);

    if (error) {
      expect(result.value).toBeInstanceOf(InvalidFileTypeError);
    }
  });
});
