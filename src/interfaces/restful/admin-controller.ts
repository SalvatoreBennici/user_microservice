import { type Request, type Response } from "express";
import { type ResetAdminPasswordPort } from "../../domain/ports/reset-admin-password-port";
import { type RegisterHouseholdUserPort } from "../../domain/ports/register-household-user-port";
import { type DeleteHouseholdUserPort } from "../../domain/ports/delete-household-user-port";

export class AdminController {
  constructor(
    private readonly resetPasswordUseCase: ResetAdminPasswordPort,
    private readonly registrationUseCase: RegisterHouseholdUserPort,
    private readonly deleteHouseholdUserUseCase: DeleteHouseholdUserPort,
  ) {}

  async registerHouseholdUser(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const { username, password } = request.body as Record<string, string>;
      await this.registrationUseCase.register(username, password);
      return response
        .status(201)
        .json({ message: "User registered successfully" });
    } catch {
      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteHouseholdUser(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const { username } = request.params as Record<string, string>;
      await this.deleteHouseholdUserUseCase.delete(username);
      return response.status(204).send();
    } catch (error: unknown) {
      const error_ = error as Error;
      if (error_.message === "User not found") {
        return response.status(404).json({ message: error_.message });
      }

      if (error_.message === "User is not a household user") {
        return response.status(400).json({ message: error_.message });
      }

      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async resetPassword(request: Request, response: Response): Promise<Response> {
    try {
      const { username, newPassword } = request.body as Record<string, string>;
      await this.resetPasswordUseCase.resetPassword(username, newPassword);
      return response.status(204).send();
    } catch (error: unknown) {
      const error_ = error as Error;
      if (error_.message === "User not found") {
        return response.status(404).json({ message: error_.message });
      }

      return response.status(500).json({ message: "Internal server error" });
    }
  }

  async test(_request: Request, response: Response): Promise<Response> {
    return response.status(200).send("Test successful");
  }
}
