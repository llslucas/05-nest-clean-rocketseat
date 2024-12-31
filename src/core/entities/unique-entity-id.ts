import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ? value : randomUUID();
  }

  toString(): string {
    return this._value;
  }

  toValue(): string {
    return this._value;
  }

  equals(id: UniqueEntityId) {
    return id.toValue() === this.toValue();
  }
}

