export interface DeleteHouseholdUserPort {
    delete(username: string): Promise<void>;
}
