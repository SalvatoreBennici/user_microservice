import {UserID} from "../../model/value-objects/UserID.vo";
import {User} from "../../model/aggregates/User";

export interface UserRepository {
    save(user: User): Promise<void>
    findById(id: UserID): Promise<User | null>
    findByUsername(username: string): Promise<User | null>
    delete(id: UserID): Promise<void>
}