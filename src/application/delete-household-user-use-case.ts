import { type DeleteHouseholdUserPort } from "../domain/ports/delete-household-user-port";
import { type UserRepository } from "../domain/ports/out_/user-repository";
import {
  NotHouseholdUserError,
  UserNotFoundError,
} from "../domain/errors/errors";
import { UserRole } from "../domain/user-role";

export class DeleteHouseholdUserUseCase implements DeleteHouseholdUserPort {
  constructor(private readonly userRepository: UserRepository) {}

  async delete(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFoundError(username);
    }

    if (user.role !== UserRole.HOUSEHOLD) {
      throw new NotHouseholdUserError(username);
    }

    await this.userRepository.delete(user.id);
  }
}
