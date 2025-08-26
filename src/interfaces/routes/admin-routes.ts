import express from 'express';
import {AdminController} from '../restful/admin-controller';
import {deleteHouseholdUserUseCase, registerHouseholdUserUseCase, resetAdminPasswordUseCase,} from '../dependencies';
import {authenticateToken, authorizeRole} from "../../presentation/middleware/auth-middleware";
import {UserRole} from "../../domain/user-role";


const router = express.Router();

const adminController = new AdminController(
    resetAdminPasswordUseCase,
    registerHouseholdUserUseCase,
    deleteHouseholdUserUseCase,
);

router.post(
    '/register',
    authenticateToken,
    authorizeRole(UserRole.ADMIN),
    adminController.registerHouseholdUser.bind(adminController),
);

router.delete(
    '/:username',
    authenticateToken,
    authorizeRole(UserRole.ADMIN),
    adminController.deleteHouseholdUser.bind(adminController),
);

router.post(
    '/reset-password',
    authenticateToken,
    authorizeRole(UserRole.ADMIN),
    adminController.resetPassword.bind(adminController),
);

router.get(
    '/test',
    //authenticateToken,
    //authorizeRole(UserRole.ADMIN, UserRole.HOUSEHOLD),
    adminController.test.bind(adminController)
);

export default router;