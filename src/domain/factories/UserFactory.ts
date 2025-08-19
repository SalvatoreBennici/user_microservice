import {UserID} from "../model/value-objects/UserID.vo";
import {UserRole} from "../model/value-objects/UserRole.vo";
import {User} from "../model/aggregates/User";

export class UserFactory {
    public static createHouseholdUser(username: string, passwordHash: string): User {
        const id = UserID.create();
        const role = UserRole.HOUSEHOLD;
        return new User(id, username, passwordHash, role);
    }
}