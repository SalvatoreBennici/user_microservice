import {type User} from "../User";
import {type UserID} from "../UserID";

export interface UserRepository {
    findUserByUsername(username: string): Promise<User | null>;
	getHouseholdUsers(): Promise<User[]>;
	findUserById(id: UserID): Promise<User | null>;
	updateUser(user: User): Promise<User>;
	addNewHouseholdUser(user: User): Promise<User>;
	removeUser(user: User): Promise<void>;
}
