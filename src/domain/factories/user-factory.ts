import {UserId} from '../model/value-objects/user-id';
import {UserRole} from '../model/value-objects/user-role';
import {User} from '../model/aggregates/user';

export const userFactory = {
	createHouseholdUser(username: string, passwordHash: string): User {
		const id = UserId.create();
		const role = UserRole.HOUSEHOLD;
		return new User(id, username, passwordHash, role);
	},
};
