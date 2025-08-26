import process from 'node:process';
import jwt, {type JwtPayload, type SignOptions} from 'jsonwebtoken';
import {
	type TokenPayload,
	type TokenService,
} from '../domain/ports/out_/token-service';

export class JwtTokenService implements TokenService {
	private readonly secret: string;
	private readonly expiration: string;

	constructor(
		secret = process.env.JWT_SECRET,
		expiration = process.env.JWT_EXPIRATION,
	) {
        if (!secret) {
            throw new Error('JWT_SECRET must be defined in the .env file');
        }
        if (!expiration) {
            throw new Error('JWT_EXPIRATION must be defined in the .env file');
        }
		this.secret = secret;
		this.expiration = expiration;
	}

	async issueToken(payload: TokenPayload): Promise<string> {
		try {
			return jwt.sign(payload, this.secret, {
				expiresIn: this.expiration,
			} as SignOptions);
		} catch (error) {
			throw error instanceof Error
				? error
				: new Error('Token generation failed');
		}
	}

	async verifyToken(token: string): Promise<TokenPayload> {
		try {
			const decoded = jwt.verify(token, this.secret) as
				| JwtPayload
				| string
				| undefined;
			if (!decoded || typeof decoded === 'string') {
				throw new Error('Invalid token');
			}

			return decoded as TokenPayload;
		} catch (error) {
			throw error instanceof Error ? error : new Error('Invalid token');
		}
	}

}
