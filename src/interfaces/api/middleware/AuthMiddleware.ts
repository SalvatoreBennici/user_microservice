import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../../domain/ports/AuthService";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          error: "Access token is required",
        });
        return;
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({
          error: "Access token is required",
        });
        return;
      }

      const user = await this.authService.verify(token);

      if (!user) {
        res.status(401).json({
          error: "Invalid or expired token",
        });
        return;
      }

      // Attach user to request object
      (req as AuthenticatedRequest).user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

  requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as AuthenticatedRequest).user;

      if (!user) {
        res.status(401).json({
          error: "Authentication required",
        });
        return;
      }

      if (user.role !== role) {
        res.status(403).json({
          error: "Insufficient permissions",
        });
        return;
      }

      next();
    };
  }

  requireOwnershipOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const user = (req as AuthenticatedRequest).user;
    const id = req.params.id;

    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (user.role === "ADMIN") {
      return next();
    }

    if (user.id.value == id) {
      return next();
    }

    res.status(403).json({ error: "Forbidden" });
  };
}
