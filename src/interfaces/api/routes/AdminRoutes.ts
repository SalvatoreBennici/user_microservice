import {Router} from 'express';
import {AuthService} from "../../../domain/ports/AuthService";
import {AuthController} from "../controllers/AuthController";
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {UserRole} from "../../../domain/UserRole";
import type {UserService} from "../../../domain/ports/UserService";
import {UserController} from "../controllers/UserController";


export function AdminRoutes(userService: UserService, authService: AuthService): Router {
    const router = Router();
    const userController = new UserController(userService);
    const authMiddleware = new AuthMiddleware(authService);

    router.post(
        '/reset-password',
        authMiddleware.authenticate,
        authMiddleware.requireRole(UserRole.ADMIN),
        userController.resetAdminPassword.bind(userController)
    );

    return router;
}
