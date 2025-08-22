import {type ChangePasswordPort} from '../domain/ports/change-password-port';
import {type UserRepository} from '../domain/ports/out_/user-repository';
import {type PasswordHasher} from '../domain/ports/out_/password-hasher';
import {
	InvalidCredentialsError,
	UserNotFoundError,
} from '../domain/errors/errors';

export class ChangePasswordUseCase implements ChangePasswordPort {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordHasher: PasswordHasher,
	) {}

	async changePassword(
		username: string,
		oldPassword: string,
		newPassword: string,
	): Promise<void> {
		const user = await this.userRepository.findByUsername(username);
		if (!user) {
			throw new UserNotFoundError(username);
		}

		const isValid = await this.passwordHasher.compare(
			oldPassword,
			user.passwordHash,
		);
		if (!isValid) {
			throw new InvalidCredentialsError();
		}

		const newHash = await this.passwordHasher.hash(newPassword);
		await user.changePasswordHash(newHash);
	}
}
