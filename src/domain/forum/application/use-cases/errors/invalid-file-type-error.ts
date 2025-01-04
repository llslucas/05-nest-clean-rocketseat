import { UseCaseError } from "@/core/types/use-case-error";

export class InvalidFileTypeError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`File type ${identifier} is invalid.`);
  }
}
