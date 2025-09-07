import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { User } from "../../domain/User";
import { UserRole } from "../../domain/UserRole";
import { UserID } from "../../domain/UserID";
import { mockHouseholdUserDavide, mockHouseholdUserMarco } from "./MockUsers";
import { ConflictError } from "../../domain/errors/ConflictError";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../../domain/errors/NotFoundError";

describe("InMemoryUserRepository", () => {
  let repository: InMemoryUserRepository;

  beforeAll(() => {
    repository = new InMemoryUserRepository();
  });

  describe("addNewHouseholdUser", () => {
    beforeEach(() => {
      repository.clear();
    });

    it("should add new user successfully", async () => {
      const result = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );

      expect(result.username).toBe(mockHouseholdUserMarco.username);
      expect(result.password).toBe(mockHouseholdUserMarco.password);
      expect(result.role).toBe(UserRole.HOUSEHOLD);
      expect(result.id.value).not.toBe("");
    });

    it("should throw ConflictError when username already exists", async () => {
      await repository.addNewHouseholdUser(mockHouseholdUserMarco);

      await expect(
        repository.addNewHouseholdUser(mockHouseholdUserMarco),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("findUserById", () => {
    let id: UserID;

    beforeAll(async () => {
      repository.clear();
      const result = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
      id = result.id;
    });

    it("should return user when valid ID exists", async () => {
      const result = await repository.findUserById(id);

      expect(result).not.toBeNull();
      expect(result?.username).toBe(mockHouseholdUserMarco.username);
    });

    it("should return null when ID does not exist", async () => {
      const nonExistentId = new UserID(uuidv4());
      const result = await repository.findUserById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe("findUserByUsername", () => {
    let username: string;

    beforeAll(async () => {
      repository.clear();
      const result = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
      username = result.username;
    });

    it("should return user when username exists", async () => {
      const result = await repository.findUserByUsername(username);

      expect(result).not.toBeNull();
      expect(result?.username).toBe(mockHouseholdUserMarco.username);
    });

    it("should return null when username does not exist", async () => {
      const nonExistentUsername = "Giovanni";
      const result = await repository.findUserByUsername(nonExistentUsername);
      expect(result).toBeNull();
    });
  });

  describe("getHouseholdUsers", () => {
    beforeAll(() => {
      repository.clear();
    });

    it("should return empty array when no users exist", async () => {
      const result = await repository.getHouseholdUsers();
      expect(result).toEqual([]);
    });

    it("should return only household users", async () => {
      await repository.addNewHouseholdUser(mockHouseholdUserMarco);

      const result = await repository.getHouseholdUsers();

      expect(result).toHaveLength(1);
      expect(result[0].role).toBe(UserRole.HOUSEHOLD);
    });
  });

  describe("updateUser", () => {
    let householdUser: User;

    beforeAll(async () => {
      repository.clear();
      householdUser = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
    });

    it("should update user successfully", async () => {
      const newUsername = "Giovanni";
      const newPassword = "password01";
      const updatedUser = {
        ...householdUser,
        username: newUsername,
        password: newPassword,
      };

      const result = await repository.updateUser(updatedUser);

      expect(result.username).toBe(newUsername);
      expect(result.password).toBe(newPassword);
      expect(result.role).toBe(UserRole.HOUSEHOLD);
    });

    it("should throw error when user not found", async () => {
      const nonExistentUser = {
        ...householdUser,
        id: new UserID(uuidv4()),
        username: "Giovanni",
        password: "password",
      };

      await expect(repository.updateUser(nonExistentUser)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw ConflictError when new username conflicts", async () => {
      const newUser = await repository.addNewHouseholdUser(
        mockHouseholdUserDavide,
      );
      const updatedUser = {
        ...householdUser,
        username: newUser.username,
      };

      await expect(repository.updateUser(updatedUser)).rejects.toThrow(
        ConflictError,
      );
    });
  });

  describe("removeUser", () => {
    let householdUser: User;

    beforeAll(async () => {
      repository.clear();
      householdUser = await repository.addNewHouseholdUser(
        mockHouseholdUserMarco,
      );
    });

    it("should remove user successfully", async () => {
      await repository.removeUser(householdUser);

      const result = await repository.findUserById(householdUser.id);
      expect(result).toBeNull();
    });

    it("should throw error when user not found", async () => {
      const nonExistentUser = {
        id: new UserID(uuidv4()),
        username: "Giovanni",
        password: "password",
        role: UserRole.HOUSEHOLD,
      };

      await expect(repository.removeUser(nonExistentUser)).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
