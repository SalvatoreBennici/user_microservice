import {type UserRepository} from '../domain/ports/out_/user-repository';
import {type UserId} from '../domain/user-id';
import {type User} from '../domain/user';

export class InMemoryUserRepository implements UserRepository {
	private users: User[] = [];

	async save(user: User): Promise<void> {
		const existingIndex = this.users.findIndex(
			(u) => u.id.value === user.id.value,
		);
		if (existingIndex !== -1) {
			this.users[existingIndex] = user;
			return;
		}

		const byUsernameIndex = this.users.findIndex(
			(u) => u.username === user.username,
		);
		if (byUsernameIndex !== -1) {
			this.users[byUsernameIndex] = user;
			return;
		}

		this.users.push(user);
	}

	async delete(id: UserId): Promise<void> {
		this.users = this.users.filter((user) => user.id.value !== id.value);
	}

	async findById(id: UserId): Promise<User | undefined> {
		return this.users.find((user) => user.id.value === id.value) ?? undefined;
	}

	async findByUsername(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username) ?? undefined;
	}
}
