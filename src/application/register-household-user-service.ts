import {type RegisterHouseholdUserPort} from '../domain/ports/register-household-user-port';
import {type UserRepository} from '../domain/ports/repositories/user-repository';
import {type PasswordHasher} from '../domain/ports/password-hasher';
import {userFactory} from '../domain/factories/user-factory';

export class RegisterHouseholdUserService implements RegisterHouseholdUserPort {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordGenerator: PasswordHasher,
	) {}

	async register(username: string, password: string): Promise<void> {
		const existingUser = await this.userRepository.findByUsername(username);
		if (existingUser) {
			throw new Error('Username is already taken.');
		}

		const passwordHash = await this.passwordGenerator.hash(password);
		const newUser = userFactory.createHouseholdUser(username, passwordHash);
		await this.userRepository.save(newUser);
	}
}
