import { UseCaseError } from "@/core/types/use-case-error";

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student ${identifier} address already exists.`);
  }
}
