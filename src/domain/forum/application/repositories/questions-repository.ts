import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findById(questionId: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract create(question: Question): Promise<Question>;
  abstract delete(questionId: string): Promise<void>;
  abstract save(question: Question): Promise<void>;
}

