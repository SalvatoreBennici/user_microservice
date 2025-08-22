export type LogoutUserPort = {
	logout(token: string): Promise<void>;
};
