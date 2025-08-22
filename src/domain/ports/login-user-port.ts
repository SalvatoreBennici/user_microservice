export type LoginUserPort = {
	login(username: string, password: string): Promise<{token: string}>;
};
