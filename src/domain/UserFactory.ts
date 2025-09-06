import {type User} from "./User";
import {UserID} from "./UserID";
import {UserRole} from "./UserRole";

export class UserFactory {
    createHouseholdUser (username: string, password: string): User {
        return {
            id: new UserID(""),
            username,
            password,
            role: UserRole.HOUSEHOLD,
        };
    }
}
