import { randomUUID } from "node:crypto";

export class UserId {
  public static create(): UserId {
    return new UserId(randomUUID());
  }

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static from(value: string): UserId {
    return new UserId(value);
  }

  get value(): string {
    return this._value;
  }
}
