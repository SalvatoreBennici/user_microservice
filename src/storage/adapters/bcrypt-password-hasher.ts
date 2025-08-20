import bcrypt from 'bcrypt';
import {type PasswordHasher} from '../../domain/ports/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
	private get saltRounds(): number {
		return 10;
	}

	async hash(password: string): Promise<string> {
		return bcrypt.hash(password, this.saltRounds);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
}
