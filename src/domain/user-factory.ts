import { UserId } from "./user-id";
import { UserRole } from "./user-role";
import { User } from "./user";

export const userFactory = {
  createHouseholdUser(username: string, passwordHash: string): User {
    const id = UserId.create();
    const role = UserRole.HOUSEHOLD;
    return new User(id, username, passwordHash, role);
  },
};
