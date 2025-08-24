import express from 'express';
import {UserController} from '../restful/user-controller';
import {
	loginUserUseCase,
	logoutUserUseCase,
	changePasswordUseCase,
	changeUsernameUseCase,
} from '../dependencies';

const router = express.Router();

const userController = new UserController(
	loginUserUseCase,
	logoutUserUseCase,
	changePasswordUseCase,
	changeUsernameUseCase,
);

// Authentication
router.post('/login', userController.login.bind(userController));
router.post('/logout', userController.logout.bind(userController));

// User management
router.post(
	'/change-password',
	userController.changePassword.bind(userController),
);
router.post(
	'/change-username',
	userController.changeUsername.bind(userController),
);

export default router;
