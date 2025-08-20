import {type DeleteHouseholdUserPort} from '../domain/ports/delete-household-user-port';
import {type UserRepository} from '../domain/ports/repositories/user-repository';
import {UserRole} from '../domain/model/value-objects/user-role';

export class DeleteHouseholdUserService implements DeleteHouseholdUserPort {
	constructor(private readonly userRepository: UserRepository) {}

	async delete(username: string): Promise<void> {
		const user = await this.userRepository.findByUsername(username);

		if (!user) {
			throw new Error('User not found');
		}

		if (user.role !== UserRole.HOUSEHOLD) {
			throw new Error('User is not a household user');
		}

		await this.userRepository.delete(user.id);
	}
}
