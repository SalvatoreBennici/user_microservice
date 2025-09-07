import { describe, it, expect, beforeAll } from "vitest";
import { app, userService } from "./app";

import request from "supertest";
import { User } from "../../domain/User";
import {
  mockAdminUser,
  mockHouseholdUserDavide,
  mockHouseholdUserMarco,
} from "../storage/MockUsers";

describe("api/household-users/ routes API", () => {
  const url = "/api/household-users";

  beforeAll(async () => {
    await userService.createHouseholdUser(
      mockHouseholdUserMarco.username,
      mockHouseholdUserMarco.password,
    );
    await userService.createHouseholdUser(
      mockHouseholdUserDavide.username,
      mockHouseholdUserDavide.password,
    );
  });

  describe("/", () => {
    it("should return the list of household users", async () => {
      const authResponse = await request(app).post("/api/auth/login").send({
        username: mockAdminUser.username,
        password: mockAdminUser.password,
      });
      const accessToken = authResponse.body.accessToken;

      const response = await request(app)
        .get(url)
        .set("Authorization", "Bearer " + accessToken);

      expect(response.status).toBe(200);

      const usernames = response.body["household-users"].map(
        (u: User) => u.username,
      );

      expect(usernames.sort()).toEqual(
        [
          mockHouseholdUserMarco.username,
          mockHouseholdUserDavide.username,
        ].sort(),
      );
    });
    it("should return 401 when no auth is provided", async () => {
      const response = await request(app).get(url);

      expect(response.status).toBe(401);
    });

    it("should return 403 when a non-admin user tries to access", async () => {
      const authResponse = await request(app).post("/api/auth/login").send({
        username: mockHouseholdUserMarco.username,
        password: mockHouseholdUserMarco.password,
      });

      const accessToken = authResponse.body.accessToken;

      const response = await request(app)
        .get(url)
        .set("Authorization", "Bearer " + accessToken);

      expect(response.status).toBe(403);
    });
  });
});
