import {type UserID} from '../UserID';
import {type User} from '../User';

export type UserService = {
	getUser(id: UserID): Promise<User | null>;
	updateUsername(id: UserID, username: string): Promise<User>;
	updatePassword(id: UserID, password: string): Promise<User>;
	createUser(username: string, password: string): Promise<User>;
	deleteUser(id: UserID): Promise<void>;
};
