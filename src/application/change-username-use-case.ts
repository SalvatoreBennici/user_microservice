import { type ChangeUsernamePort } from "../domain/ports/change-username-port";
import { type UserRepository } from "../domain/ports/out_/user-repository";
import { UsernameTakenError, UserNotFoundError } from "../domain/errors/errors";

export class ChangeUsernameUseCase implements ChangeUsernamePort {
  constructor(private readonly userRepository: UserRepository) {}

  async changeUsername(
    currentUsername: string,
    newUsername: string,
  ): Promise<void> {
    if (currentUsername === newUsername) {
      return;
    }

    const user = await this.userRepository.findByUsername(currentUsername);
    if (!user) {
      throw new UserNotFoundError(currentUsername);
    }

    const existing = await this.userRepository.findByUsername(newUsername);
    if (existing) {
      throw new UsernameTakenError(newUsername);
    }

    user.changeUsername(newUsername);
  }
}
