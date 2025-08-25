import type {UserID} from "../../domain/UserID";
import type {UserRole} from "../../domain/UserRole";

export type AccessTokenPayload = {
    id: UserID;
    username: string;
    role: UserRole;
};