import {type UserRepository} from '../../domain/ports/repositories/user-repository';
import {type UserId} from '../../domain/model/value-objects/user-id';
import {type User} from '../../domain/model/aggregates/user';

export class InMemoryUserRepository implements UserRepository {
	private users: User[] = [];

	async save(user: User): Promise<void> {
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
