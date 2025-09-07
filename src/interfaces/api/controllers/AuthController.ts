import { type Request, type Response } from "express";

import { AuthService } from "../../../domain/ports/AuthService";
import { AccessTokenMapper } from "../../../presentation/AccessTokenMapper";
import { AuthenticatedRequest } from "../middleware/AuthenticatedRequest";
import { InvalidRequest } from "../errors/InvalidRequest";
import { FieldRequiredError } from "../errors/FieldRequired";
import { InvalidCredentials } from "../../../domain/errors/InvalidCredentials";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: Request, res: Response): Promise<void> {
    try {
      const { username } = request.body;
      const { password } = request.body;

      if (!username) {
        res.status(400).json(FieldRequiredError("Username"));
        return;
      }

      if (!password) {
        res.status(400).json(FieldRequiredError("Password"));
        return;
      }

      const token = await this.authService.login(username, password);

      res.status(200).json(AccessTokenMapper.toDTO(token));
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        res.status(422).json({ error: error.message });
      }

      res.status(400).json(InvalidRequest);
    }
  }

  async logout(request: Request, res: Response): Promise<void> {
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
      res.status(400).json({
        error: "Token is required",
      });
      return;
    }

    console.log(token);

    await this.authService.logout(token);

    res.status(200).json({
      message: "Logout successful",
    });
  }

  async refresh(request: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        res.status(400).json(FieldRequiredError("Refresh token"));
        return;
      }

      const token = await this.authService.refresh(refreshToken);

      res.status(200).json(AccessTokenMapper.toDTO(token));
    } catch {
      res.status(400).json(InvalidRequest);
    }
  }

  async whoami(request: Request, res: Response): Promise<void> {
    const user = (request as AuthenticatedRequest).user;

    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.status(200).json({
      message: "hello",
      user: {
        id: user.id.value,
        username: user.username,
        role: user.role,
      },
    });
  }
}
