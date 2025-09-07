import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { UserService } from "../../domain/ports/UserService";
import { InMemoryUserRepository } from "../storage/InMemoryUserRepository";
import { UserServiceImpl } from "../../application/adapter/UserServiceImpl";
import {
  mockHouseholdUserDavide,
  mockHouseholdUserMarco,
} from "../storage/MockUsers";
import { UserRole } from "../../domain/UserRole";
import bcrypt from "bcrypt";
import { UserID } from "../../domain/UserID";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../../domain/errors/NotFoundError";
import { User } from "../../domain/User";
import { ConflictError } from "../../domain/errors/ConflictError";

describe("UserService", () => {
  let userService: UserService;
  let repository: InMemoryUserRepository;

  beforeAll(() => {
    repository = new InMemoryUserRepository();
    userService = new UserServiceImpl(repository);
  });

  describe("createHouseholdUser", () => {
    beforeEach(() => {
      repository.clear();
    });

    it("should add new household user to the repository", async () => {
      const testUser = mockHouseholdUserMarco;
      const result = await userService.createHouseholdUser(
        testUser.username,
        testUser.password,
      );

      expect(result.id.value).not.toBe("");
      expect(result.username, testUser.username);
      expect(result.role).toBe(UserRole.HOUSEHOLD);
    });

    it("should hash the password and format the username", async () => {
      const username = "Username";
      const password = "password";

      const result = await userService.createHouseholdUser(username, password);

      const passwordMatch = await bcrypt.compare(password, result.password);

      expect(passwordMatch).toBe(true);
      expect(result.username, "username");
    });
  });

  describe("getUser", () => {
    let id: UserID;
    let username: string;

    beforeAll(async () => {
      repository.clear();

      const result = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
      id = result.id;
      username = result.username;
    });

    it("should return user when valid ID exist", async () => {
      const result = await userService.getUser(id);

      expect(result).not.toBeNull();
      expect(result?.username).toBe(username);
    });

    it("should return null when ID does not exist", async () => {
      const nonExistentId = new UserID(uuidv4());
      const result = await userService.getUser(nonExistentId);
      expect(result).toBeNull();
    });
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
      const result = await userService.createHouseholdUser(
        user.username,
        user.password,
      );

      const formattedUser = user.username.toLowerCase().trim();

      expect(result.username).toBe(formattedUser);
      expect(result.password).not.toBe(user.password);
    });
  });

  describe("deleteUser", () => {
    let id: UserID;

    beforeAll(async () => {
      repository.clear();

      const result = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
      id = result.id;
    });

    it("should delete user successfully", async () => {
      await userService.deleteUser(id);

      const result = await repository.findUserById(id);
      expect(result).toBeNull();
    });

    it("should throw error when user not found", async () => {
      await expect(
        userService.deleteUser(new UserID(uuidv4())),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateHouseholdUsername", () => {
    let householdUser: User;

    beforeAll(async () => {
      repository.clear();
      householdUser = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
    });

    it("should update household user's username successfully", async () => {
      const newUsername = "matteo";
      const result = await userService.updateHouseholdUsername(
        householdUser.id,
        newUsername,
      );

      expect(result.username).toBe(newUsername);
    });

    it("should throw error when user not found", async () => {
      await expect(
        userService.updateHouseholdUsername(new UserID(uuidv4()), "username"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError when new username conflicts", async () => {
      const newUser = await repository.addNewHouseholdUser(
        mockHouseholdUserDavide,
      );

      await expect(
        userService.updateHouseholdUsername(householdUser.id, newUser.username),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("updatePassword", () => {
    let householdUser: User;

    beforeAll(async () => {
      repository.clear();
      householdUser = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
    });

    it("should update user's password successfully", async () => {
      const newPassword = "password123";
      const result = await userService.updatePassword(
        householdUser.id,
        newPassword,
      );

      const passwordMatch = await bcrypt.compare(newPassword, result.password);

      expect(passwordMatch).toBe(true);
    });

    it("should throw error when user not found", async () => {
      await expect(
        userService.updatePassword(new UserID(uuidv4()), "password"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  // describe("resetAdminPassword", async () => {
  //
  // });
});
