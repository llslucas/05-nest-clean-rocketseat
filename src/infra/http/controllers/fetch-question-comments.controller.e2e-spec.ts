import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch question comments (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const comments = await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      }),
    ]);

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    // console.log(response.body);

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        comments: expect.arrayContaining([
          expect.objectContaining({
            commentId: comments[0].id.toString(),
            authorName: user.name,
          }),
          expect.objectContaining({
            commentId: comments[1].id.toString(),
            authorName: user.name,
          }),
        ]),
      })
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
