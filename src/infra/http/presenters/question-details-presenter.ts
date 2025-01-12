import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.author,
      title: questionDetails.title,
      content: questionDetails.content,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      bestAnswerId: questionDetails.bestAnswerId
        ? questionDetails.bestAnswerId.toString()
        : null,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    };
  }
}
