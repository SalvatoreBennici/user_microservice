import { type Request, type Response } from "express";
import { type UserService } from "../../../domain/ports/UserService";
import { UserMapper } from "../../../presentation/UserMapper";
import { UserID } from "../../../domain/UserID";
import { ConflictError } from "../../../domain/errors/ConflictError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getHouseholdUsers(request: Request, res: Response): Promise<void> {
    try {
      const householdUsers = await this.userService.getHouseholdUsers();

      res.json({
        "household-users": householdUsers.map((user) => UserMapper.toDTO(user)),
      });
    } catch {
      res.status(500).send();
    }
  }

  async createHouseholdUser(request: Request, res: Response): Promise<void> {
    try {
      const { username, password } = request.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const user = await this.userService.createHouseholdUser(
        username,
        password,
      );

      const userDTO = UserMapper.toDTO(user);

      res.status(201).json(userDTO);
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(400).json();
    }
  }

  async getUser(request: Request, res: Response): Promise<void> {
    try {
      const { id } = request.params;
      const userID = new UserID(id);

      const user = await this.userService.getUser(userID);

      console.log(user);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      console.log(user.id.value.toString());

      res.json(UserMapper.toDTO(user));
    } catch {
      res.status(500).send();
    }
  }

  async updatePassword(request: Request, res: Response): Promise<void> {
    try {
      const { id } = request.params;
      const { password } = request.body;

      if (!password) {
        res.status(400).json({ error: "Password is required" });
        return;
      }

      const userID = new UserID(id);
      await this.userService.updatePassword(userID, password);

      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(400).json((error as Error).message);
    }
  }

  async updateUsername(request: Request, res: Response): Promise<void> {
    try {
      const { id } = request.params;
      const { username } = request.body;

      if (!username) {
        res.status(400).json({ error: "Username is required" });
        return;
      }

      const userID = new UserID(id);
      const updatedUser = await this.userService.updateHouseholdUsername(
        userID,
        username,
      );
      const userDTO = UserMapper.toDTO(updatedUser);

      res.json(userDTO);
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message });
        return;
      }

      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      }

      res.status(400).json();
    }
  }

  async deleteUser(request: Request, res: Response): Promise<void> {
    try {
      const { id } = request.params;
      const userID = new UserID(id);

      await this.userService.deleteUser(userID);

      res.status(206).send({
        response: "User deleted",
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      }
      res.status(400).json();
    }
  }

  async resetAdminPassword(request: Request, res: Response): Promise<void> {
    try {
      const { resetCode, password } = request.body;

      if (!resetCode || !password) {
        res.status(400).json({ error: "Reset code and password are required" });
        return;
      }

      await this.userService.resetAdminPassword(resetCode, password);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(400).json();
    }
  }
}
