import express from 'express';
import {AdminController} from '../restful/admin-controller';
import {
	registerHouseholdUserUseCase,
	deleteHouseholdUserUseCase,
	resetAdminPasswordUseCase,
} from '../dependencies';

const router = express.Router();

const adminController = new AdminController(
	resetAdminPasswordUseCase,
	registerHouseholdUserUseCase,
	deleteHouseholdUserUseCase,
);

// User management
router.post(
	'/users/register',
	adminController.registerHouseholdUser.bind(adminController),
);

router.delete(
	'/users/:username',
	adminController.deleteHouseholdUser.bind(adminController),
);

router.post(
	'/users/reset-password',
	adminController.resetPassword.bind(adminController),
);

// Test endpoint
router.get('/test', adminController.test.bind(adminController));

export default router;
