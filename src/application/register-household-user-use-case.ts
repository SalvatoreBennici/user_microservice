import { type RegisterHouseholdUserPort } from "../domain/ports/register-household-user-port";
import { type UserRepository } from "../domain/ports/out_/user-repository";
import { type PasswordHasher } from "../domain/ports/out_/password-hasher";
import { UsernameTakenError } from "../domain/errors/errors";
import { userFactory } from "../domain/user-factory";

export class RegisterHouseholdUserUseCase implements RegisterHouseholdUserPort {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordGenerator: PasswordHasher,
  ) {}

  async register(username: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new UsernameTakenError(username);
    }

    const passwordHash = await this.passwordGenerator.hash(password);
    const newUser = userFactory.createHouseholdUser(username, passwordHash);
    await this.userRepository.save(newUser);
  }
}
