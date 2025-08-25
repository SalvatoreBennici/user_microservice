
import {AccessTokenPayload} from "./AccessTokenPayload";

export interface TokenService{
    generateAccessToken(payload: AccessTokenPayload): Promise<string>;
    generateRefreshToken(payload: AccessTokenPayload): Promise<string>;

    verifyToken(token: string): Promise<AccessTokenPayload | null>;
}