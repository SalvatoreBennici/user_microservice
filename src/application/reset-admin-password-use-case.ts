import { type ResetAdminPasswordPort } from "../domain/ports/reset-admin-password-port";
import { type UserRepository } from "../domain/ports/out_/user-repository";
import { type PasswordHasher } from "../domain/ports/out_/password-hasher";
import { UserNotFoundError } from "../domain/errors/errors";

export class ResetAdminPasswordUseCase implements ResetAdminPasswordPort {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async resetPassword(username: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UserNotFoundError(username);
    }

    const newHash = await this.passwordHasher.hash(newPassword);
    await user.changePasswordHash(newHash);
  }
}
