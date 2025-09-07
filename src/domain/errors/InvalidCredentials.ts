export class InvalidCredentials extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
  }
}
