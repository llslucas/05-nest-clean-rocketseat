import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Edit answer (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /answers/:answerId", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachments = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ]);

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    await Promise.all(
      attachments.map((attachment) => {
        return answerAttachmentFactory.makePrismaAnswerAttachment({
          attachmentId: attachment.id,
          answerId: answer.id,
        });
      })
    );

    const newAttachment = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post(`/answers/${answer.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New Content",
        attachments: [
          attachments[0].id.toString(),
          newAttachment.id.toString(),
        ],
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "New Content",
      },
    });

    expect(answerOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachments[0].id.toString() }),
        expect.objectContaining({ id: newAttachment.id.toString() }),
      ])
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
