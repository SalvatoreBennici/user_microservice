import {UserRepository} from "../../domain/ports/repositories/UserRepository";
import {UserID} from "../../domain/model/value-objects/UserID.vo";
import {User} from "../../domain/model/aggregates/User";

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = []

    async save(user: User): Promise<void> {
        this.users.push(user);
    }

    async delete(id: UserID): Promise<void> {
        this.users = this.users.filter(user => user.id.value !== id.value);
    }

    async findById(id: UserID): Promise<User | null> {
        return this.users.find(user => user.id.value === id.value) || null;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.users.find(user => user.username === username) || null;
    }


}