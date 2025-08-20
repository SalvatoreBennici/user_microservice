import {type UserId} from '../../model/value-objects/user-id.js';
import {type User} from '../../model/aggregates/user.js';

export type UserRepository = {
	save(user: User): Promise<void>;
	findById(id: UserId): Promise<User | undefined>;
	findByUsername(username: string): Promise<User | undefined>;
	delete(id: UserId): Promise<void>;
};
