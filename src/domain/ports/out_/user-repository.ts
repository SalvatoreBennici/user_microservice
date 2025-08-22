import {type UserId} from '../../user-id';
import {type User} from '../../user';

export type UserRepository = {
	save(user: User): Promise<void>;
	findById(id: UserId): Promise<User | undefined>;
	findByUsername(username: string): Promise<User | undefined>;
	delete(id: UserId): Promise<void>;
};
