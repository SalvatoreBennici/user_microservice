import { User } from "../User";
import { AccessToken } from "../AccessToken";

export interface AuthService {
  login(username: string, password: string): Promise<AccessToken>;
  logout(username: string): Promise<void>;
  verify(token: string): Promise<User | null>;
  refresh(token: string): Promise<AccessToken>;
}
