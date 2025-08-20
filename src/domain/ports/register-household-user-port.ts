export type RegisterHouseholdUserPort = {
	register(username: string, password: string): Promise<void>;
};
