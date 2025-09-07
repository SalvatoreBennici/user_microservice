import { type UserID } from "../UserID";
import { type User } from "../User";

export interface UserService {
  getHouseholdUsers(): Promise<User[]>;
  getUser(id: UserID): Promise<User | null>;
  updateHouseholdUsername(id: UserID, username: string): Promise<User>;
  updatePassword(id: UserID, password: string): Promise<User>;
  createHouseholdUser(username: string, password: string): Promise<User>;
  deleteUser(id: UserID): Promise<void>;
  resetAdminPassword(resetCode: string, password: string): Promise<User>;
}
