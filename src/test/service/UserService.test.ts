import {beforeAll, beforeEach, describe, expect, it,} from "vitest";
import {UserService} from "../../domain/ports/UserService";
import {InMemoryUserRepository} from "../storage/InMemoryUserRepository";
import {UserServiceImpl} from "../../application/adapter/UserServiceImpl";
import {mockHouseholdUserMarco} from "../storage/MockUsers";
import {UserRole} from "../../domain/UserRole";


// getUser(id: UserID): Promise<User | null>;
// updateHouseholdUsername(id: UserID, username: string): Promise<User>;
// updatePassword(id: UserID, password: string): Promise<User>;
// createHouseholdUser(username: string, password: string): Promise<User>;
// deleteUser(id: UserID): Promise<void>;
// resetAdminPassword(resetCode: string, password: string): Promise<User>;

describe("UserService", () => {
    let userService: UserService;
    let repository: InMemoryUserRepository;

    beforeAll(() => {
        repository = new InMemoryUserRepository();
        userService = new UserServiceImpl(repository);
    });

    describe("getHouseholdUsers", () => {
        beforeAll(() => {
            repository.clear();
        });

        it("should return the household users from the repository", async () => {
            await repository.addNewHouseholdUser(mockHouseholdUserMarco);

            const result = await userService.getHouseholdUsers();

            expect(result).toHaveLength(1);
            expect(result[0].role).toBe(UserRole.HOUSEHOLD);
        });
    });

    describe("createHouseholdUser", () => {
        beforeEach(() => {
            repository.clear();
        });

        it("should add new user to the repository with password hashed and username formatted", async () => {
            const user = mockHouseholdUserMarco;
            const result = await userService.createHouseholdUser(user.username, user.password);

            const formattedUser = user.username.toLowerCase().trim();

            expect(result.username).toBe(formattedUser);
            expect(result.password).not.toBe(user.password);
        });
    });

});