import bcrypt from "bcrypt";
import { type UserRepository } from "../domain/ports/out_/user-repository";
import { UserId } from "../domain/user-id";
import { User } from "../domain/user";
import { UserRole } from "../domain/user-role";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  // TECH-DEBT: This is a temporary solution.
  constructor() {
    const id = UserId.create();
    const hash = bcrypt.hashSync("admin", 10);
    const adminUser = new User(id, "admin", hash, UserRole.ADMIN);
    this.users.push(adminUser);
  }

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
