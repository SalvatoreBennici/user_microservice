import {TokenService} from "../port/TokenService";
import {AccessTokenPayload} from "../port/AccessTokenPayload";

import jwt from 'jsonwebtoken';

export class JWTService implements TokenService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly JWT_EXPIRES_IN = '8h';
    private static readonly REFRESH_EXPIRES_IN = '7d';

    private generateJWT(payload: AccessTokenPayload, expirationTime: any): string{
        return jwt.sign(
            payload,
            JWTService.JWT_SECRET,
            { expiresIn: expirationTime}
        );
    }

    async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
        return this.generateJWT(payload, JWTService.JWT_EXPIRES_IN);
    }

    async generateRefreshToken(payload: AccessTokenPayload): Promise<string> {
        return this.generateJWT(payload, JWTService.REFRESH_EXPIRES_IN);
    }

    async verifyToken(token: string): Promise<AccessTokenPayload | null>{
        try {
            return jwt.verify(token, JWTService.JWT_SECRET) as AccessTokenPayload;
        } catch {
            return null;
        }
    }
}