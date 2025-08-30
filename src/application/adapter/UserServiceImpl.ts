import * as bcrypt from 'bcrypt';
import {type User} from '../../domain/User';
import {type UserID} from '../../domain/UserID';
import {UserFactory} from '../../domain/UserFactory';
import {type UserService} from '../../domain/ports/UserService';
import {type UserRepository} from '../../domain/ports/UserRepository';
import {NotFoundError} from "../../domain/errors/NotFoundError";
import {InvalidCredentials} from "../../domain/errors/InvalidCredentials";
import {UserRole} from "../../domain/UserRole";

export class UserServiceImpl implements UserService {
	private static readonly SALT_ROUNDS = 10;
    private static readonly RESET_CODE = process.env.RESET_CODE || 'your-secret-code';

	constructor(private readonly userRepository: UserRepository) {}

    async getHouseholdUsers(): Promise<User[]> {
        return await this.userRepository.getHouseholdUsers();
    }

	async getUser(id: UserID): Promise<User | null> {
		return await this.userRepository.findUserById(id);
	}

    async createHouseholdUser(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(
            password,
            UserServiceImpl.SALT_ROUNDS,
        );

        const newHouseholdUser = new UserFactory().createHouseholdUser(
            username.toLowerCase().trim(),
            hashedPassword,
        );

        return this.userRepository.addNewHouseholdUser(newHouseholdUser);
    }

	async updateHouseholdUsername(id: UserID, username: string): Promise<User> {
		const existingUser = await this.userRepository.findUserById(id);

		if (!existingUser) {
            throw new NotFoundError('User not found');
		}

		const updatedUser: User = {
			...existingUser,
			username: username.trim(),
		};

		return this.userRepository.updateUser(updatedUser);
	}

	async updatePassword(id: UserID, password: string): Promise<User> {
		const existingUser = await this.userRepository.findUserById(id);

		if (!existingUser) {
			throw new NotFoundError('User not found');
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

	async deleteUser(id: UserID): Promise<void> {
		const existingUser = await this.userRepository.findUserById(id);
		if (!existingUser) {
            throw new NotFoundError('User not found');
		}

		await this.userRepository.removeUser(existingUser);
	}

    async resetAdminPassword(resetCode: string, password: string): Promise<User> {
        if (resetCode != UserServiceImpl.RESET_CODE) {
            throw new InvalidCredentials()
        }
        const admin = await this.userRepository.findUserByUsername('admin');

        if (!admin) {
            throw new NotFoundError('User not found');
        }

        const hashedPassword = await bcrypt.hash(
            password,
            UserServiceImpl.SALT_ROUNDS,
        );

        const updatedUser: User = {
            ...admin,
            password: hashedPassword,
        };

        return this.userRepository.updateUser(updatedUser);
    }
}
