import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "@/auth/current-user.decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { UserPayload } from "@/auth/jwt.strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const validationPipe = new ZodValidationPipe(createQuestionBodySchema);

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(validationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = generateSlug(title);

    const questionWithSameSlug = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    });

    if (questionWithSameSlug) {
      throw new ConflictException();
    }

    const question = await this.prismaService.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });

    return { question };
  }
}

function generateSlug(title: string) {
  const normalized = title.normalize("NFD");
  const withoutAccents = normalized.replace(/\p{Diacritic}/gu, "");

  const lowercase = withoutAccents.toLowerCase();
  let slug = lowercase.replace(/[^a-z0-9]+/g, "-");

  // eslint-disable-next-line no-useless-escape
  slug = slug.replace(/^\-+|\-+$/g, "");

  return slug;
}
