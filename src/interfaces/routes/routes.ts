import express from 'express';
import adminRoutes from './admin-routes';
import userRoutes from './user-routes';

const router = express.Router();

// Admin routes
router.use('/admin', adminRoutes);

// User routes
router.use('/users', userRoutes);

export default router;
