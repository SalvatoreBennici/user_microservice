export type TokenPayload = {
  userId: string;
  role: string;
};

export type TokenService = {
  issueToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
};
