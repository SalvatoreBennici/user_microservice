import {Router} from "express";
import {UserController} from "../controllers/UserController";
import {type UserService} from "../../../domain/ports/UserService";
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {AuthService} from "../../../domain/ports/AuthService";

export function UserRoutes (userService: UserService, authService: AuthService): Router {
    const router = Router();
    const userController = new UserController(userService);
    const authMiddleware = new AuthMiddleware(authService);


    router.get("/:id", authMiddleware.authenticate, userController.getUser.bind(userController));

    router.put(
        "/:id/password",
        authMiddleware.authenticate,
        authMiddleware.requireOwnershipOrAdmin,
        userController.updatePassword.bind(userController),
    );

    return router;
}
