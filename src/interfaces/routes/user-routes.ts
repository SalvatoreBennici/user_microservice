import express from 'express';
import {UserController} from '../restful/user-controller';
import {authenticateToken, authorizeRole} from "../../presentation/middleware/auth-middleware";

import {changePasswordUseCase, changeUsernameUseCase, loginUserUseCase,} from '../dependencies';
import {UserRole} from "../../domain/user-role";

const router = express.Router();

const userController = new UserController(
	loginUserUseCase,
	changePasswordUseCase,
	changeUsernameUseCase,
);

// Authentication
router.post('/login', userController.login.bind(userController));

// User management
router.post(
	'/change-password',
    authenticateToken,
    authorizeRole(UserRole.HOUSEHOLD),
	userController.changePassword.bind(userController),
);
router.post(
	'/change-username',
    authenticateToken,
    authorizeRole(UserRole.HOUSEHOLD),
	userController.changeUsername.bind(userController),
);

export default router;
