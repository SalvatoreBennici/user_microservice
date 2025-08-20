export type DeleteHouseholdUserPort = {
	delete(username: string): Promise<void>;
};
