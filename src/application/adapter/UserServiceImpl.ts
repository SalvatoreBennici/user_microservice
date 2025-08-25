import * as bcrypt from 'bcrypt';
import {type User} from '../../domain/User';
import {type UserID} from '../../domain/UserID';
import {UserFactory} from '../../domain/UserFactory';
import {type UserService} from '../../domain/ports/UserService';
import {type UserRepository} from '../../domain/ports/UserRepository';

export class UserServiceImpl implements UserService {
	private static readonly SALT_ROUNDS = 10;

	constructor(private readonly userRepository: UserRepository) {}

	async getUser(id: UserID): Promise<User | null> {
		return this.userRepository.findUserById(id);
	}

	async updateUsername(id: UserID, username: string): Promise<User> {
		if (!username || username.trim().length === 0) {
			throw new Error('Username must be non-empty');
		}

		const existingUser = await this.userRepository.findUserById(id);

		if (!existingUser) {
			throw new Error('User not found');
		}

		const updatedUser: User = {
			...existingUser,
			username: username.trim(),
		};

		return this.userRepository.updateUser(updatedUser);
	}

	async updatePassword(id: UserID, password: string): Promise<User> {
		if (!password || password.length === 0) {
			throw new Error('Password must be non-empty');
		}

		const existingUser = await this.userRepository.findUserById(id);
		if (!existingUser) {
			throw new Error('User not found');
		}

		const hashedPassword = await bcrypt.hash(
			password,
			UserServiceImpl.SALT_ROUNDS,
		);
		const updatedUser: User = {
			...existingUser,
			password: hashedPassword,
		};

		return this.userRepository.updateUser(updatedUser);
	}

	async createUser(username: string, password: string): Promise<User> {
		const hashedPassword = await bcrypt.hash(
			password,
			UserServiceImpl.SALT_ROUNDS,
		);

		const newUser = new UserFactory().createHouseholdUser(
			username.trim(),
			hashedPassword,
		);

		console.log(newUser);

		return this.userRepository.addNewUser(newUser);
	}

	async deleteUser(id: UserID): Promise<void> {
		const existingUser = await this.userRepository.findUserById(id);
		if (!existingUser) {
			throw new Error('User not found');
		}

		await this.userRepository.removeUser(existingUser);
	}
}
