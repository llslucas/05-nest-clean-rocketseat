import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Answer question (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachments = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ]);

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString();
    });

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Question content",
        attachments: attachmentIds,
      });

    expect(response.statusCode).toBe(201);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "Question content",
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
        expect.objectContaining({ id: attachments[1].id.toString() }),
      ])
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
