import express from "express";
import { HouseholdUserRoutes } from "../../interfaces/api/routes/HouseholdUserRoutes";
import { InMemoryUserRepository } from "../storage/InMemoryUserRepository";
import { UserServiceImpl } from "../../application/adapter/UserServiceImpl";
import { AuthServiceImpl } from "../../application/adapter/AuthServiceImpl";
import { JWTService } from "../../application/adapter/JWTService";
import { AuthRoutes } from "../../interfaces/api/routes/AuthRoutes";
import { mockAdminUser } from "../storage/MockUsers";
import * as bcrypt from "bcrypt";

const app = express();

app.use(express.json());

const userRepository = new InMemoryUserRepository();
const userService = new UserServiceImpl(userRepository);
const authService = new AuthServiceImpl(userRepository, new JWTService());

app.use("/api/household-users", HouseholdUserRoutes(userService, authService));
app.use("/api/auth", AuthRoutes(authService));

bcrypt.hash("admin", 10).then((passwordHashed) => {
  userRepository.addNewHouseholdUser({
    ...mockAdminUser,
    password: passwordHashed,
  });
});

export { app, userService };
