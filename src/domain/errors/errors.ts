export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export class NotHouseholdUserError extends Error {
  constructor(username: string) {
    super(`User is not a household user: ${username}`);
    this.name = "NotHouseholdUserError";
  }
}

export class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`User not found: ${username}`);
    this.name = "UserNotFoundError";
  }
}

export class UsernameTakenError extends Error {
  constructor(username: string) {
    super(`Username is already taken: ${username}`);
    this.name = "UsernameTakenError";
  }
}
