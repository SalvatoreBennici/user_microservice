import {Router} from 'express';
import {UserController} from '../controllers/UserController';
import {type UserService} from '../../../domain/ports/UserService';
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {AuthService} from "../../../domain/ports/AuthService";
import {UserRole} from "../../../domain/UserRole";

export function UserRoutes(userService: UserService, authService: AuthService): Router {
	const router = Router();
	const userController = new UserController(userService);
    const authMiddleware = new AuthMiddleware(authService);

    // Create new household user
	router.post('/household/', authMiddleware.authenticate, authMiddleware.requireRole(UserRole.ADMIN), userController.createUser.bind(userController));

	router.get('/:id', userController.getUser.bind(userController));
	router.put(
		'/:id/username',
		userController.updateUsername.bind(userController),
	);
	router.put(
		'/:id/password',
		userController.updatePassword.bind(userController),
	);
	router.delete('/:id', userController.deleteUser.bind(userController));

	return router;
}
