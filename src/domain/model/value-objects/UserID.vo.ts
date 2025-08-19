import { randomUUID } from 'crypto';

export class UserID {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public static create(): UserID {
        return new UserID(randomUUID());
    }

    get value(): string {
        return this._value;
    }

    public static from(value: string): UserID {
        return new UserID(value);
    }
}