import {Router} from "express";
import {UserController} from "../controllers/UserController";
import {type UserService} from "../../../domain/ports/UserService";
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {AuthService} from "../../../domain/ports/AuthService";
import {UserRole} from "../../../domain/UserRole";

export function HouseholdUserRoutes (userService: UserService, authService: AuthService): Router {
    const router = Router();
    const userController = new UserController(userService);
    const authMiddleware = new AuthMiddleware(authService);

    // list of household user
    router.get(
        "/",
        authMiddleware.authenticate,
        authMiddleware.requireRole(UserRole.ADMIN),
        userController.getHouseholdUsers.bind(userController)
    );

    // new household user
    router.post(
        "/",
        authMiddleware.authenticate,
        authMiddleware.requireRole(UserRole.ADMIN),
        userController.createHouseholdUser.bind(userController)
    );

    router.put(
        "/:id/username",
        authMiddleware.authenticate,
        authMiddleware.requireOwnershipOrAdmin,
        userController.updateUsername.bind(userController),
    );

    router.delete("/:id", userController.deleteUser.bind(userController));

    return router;
}
