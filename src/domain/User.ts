import {type UserID} from './UserID';
import {type UserRole} from './UserRole';

export type User = {
	id: UserID;
	username: string;
	password: string;
	role: UserRole;
};
