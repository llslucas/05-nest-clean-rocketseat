import { HashComparer } from "@/domain/forum/application/cryptografy/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptografy/hash-generator";
import { hash, compare } from "bcryptjs";

export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly saltRounds = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.saltRounds);
  }

  compare(plain: string, hashed: string) {
    return compare(plain, hashed);
  }
}
