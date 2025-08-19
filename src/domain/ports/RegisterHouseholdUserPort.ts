export interface RegisterHouseholdUserPort {
  register(username: string, password: string): Promise<void>
}