import type { UserID } from "../../domain/UserID";
import type { UserRole } from "../../domain/UserRole";

export interface AccessTokenPayload {
  id: UserID;
  username: string;
  role: UserRole;
}
