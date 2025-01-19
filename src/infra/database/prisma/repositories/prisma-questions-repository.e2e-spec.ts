import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentFactory } from "test/factories/make-student";

describe("Prisma questions repository (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionsRepository: QuestionsRepository;
  let cacheRepository: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [QuestionFactory, StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    questionFactory = moduleRef.get(QuestionFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionsRepository);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  it("show cache question details on the first search.", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionOnDatabase = await questionsRepository.findDetailsBySlug(
      question.slug.value
    );

    const cachedQuestionDetails = await cacheRepository.get(
      `questions:${question.slug.value}:details`
    );

    if (!cachedQuestionDetails || !questionOnDatabase) {
      throw new Error();
    }

    expect(JSON.parse(cachedQuestionDetails)).toEqual(
      expect.objectContaining({
        id: questionOnDatabase.questionId.toString(),
      })
    );
  });

  it("show retrieve cached question details after the first search.", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionsRepository.findDetailsBySlug(question.slug.value);

    const cachedData = await cacheRepository.get(
      `questions:${question.slug.value}:details`
    );

    if (!cachedData) {
      throw new Error();
    }

    const cachedQuestion = JSON.parse(cachedData);
    cachedQuestion.title = "Cached Question";

    cacheRepository.set(
      `questions:${question.slug.value}:details`,
      JSON.stringify(cachedQuestion)
    );

    const questionOnDatabase = await questionsRepository.findDetailsBySlug(
      question.slug.value
    );

    expect(questionOnDatabase?.title).toEqual("Cached Question");
  });

  it("show delete cached question details after question update.", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionsRepository.findDetailsBySlug(question.slug.value);

    question.title = "Updated question";

    await questionsRepository.save(question);

    const cachedQuestionDetails = await cacheRepository.get(
      `questions:${question.slug.value}:details`
    );

    expect(cachedQuestionDetails).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
