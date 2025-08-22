export type TokenPayload = {
	userId: string;
	username: string;
	role: string;
};

export type TokenService = {
	issueToken(payload: TokenPayload): Promise<string>;
	verifyToken(token: string): Promise<TokenPayload>;
	revokeToken(token: string): Promise<void>;
};
