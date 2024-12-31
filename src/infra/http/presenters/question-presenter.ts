import { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      author_id: question.authorId.toString(),
      best_answer_id: question.bestAnswerId
        ? question.bestAnswerId.toValue()
        : null,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
    };
  }
}
