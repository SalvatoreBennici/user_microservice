import { UserID } from '../value-objects/UserID.vo';
import { UserRole } from '../value-objects/UserRole.vo';


export class User {
    constructor(
        private readonly _id: UserID,
        private _username: string,
        private _passwordHash: string,
        private readonly _role: UserRole
    ) {
    }

    get id(): UserID {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    public changeUsername(newUsername: string): void {
        if (!newUsername) {
            throw new Error('Username cannot be empty.');
        }
        this._username = newUsername;
    }

    public async changePasswordHash(newPasswordHash: string): Promise<void> {
        if (!newPasswordHash) {
            throw new Error('PasswordHash cannot be empty.');
        }
        this._passwordHash = newPasswordHash
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get role(): UserRole {
        return this._role;
    }
}