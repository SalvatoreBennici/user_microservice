import { Router } from "express";
import { AuthService } from "../../../domain/ports/AuthService";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { UserRole } from "../../../domain/UserRole";

export function AuthRoutes(authService: AuthService): Router {
  const router = Router();
  const authController = new AuthController(authService);
  const authMiddleware = new AuthMiddleware(authService);

  // Bind methods to maintain 'this' context
  router.post("/login", authController.login.bind(authController));
  router.post(
    "/logout",
    authMiddleware.authenticate,
    authController.logout.bind(authController),
  );

  router.get(
    "/refresh",
    authMiddleware.authenticate,
    authController.refresh.bind(authController),
  );

  router.get(
    "/whoami",
    authMiddleware.authenticate,
    authMiddleware.requireRole(UserRole.HOUSEHOLD),
    authController.whoami.bind(authController),
  );

  return router;
}
