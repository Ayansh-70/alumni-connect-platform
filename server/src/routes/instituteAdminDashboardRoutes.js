import { Router } from 'express';
import { getDashboardStats } from '../controllers/instituteAdminDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.INSTITUTE_ADMIN));

router.get('/stats', getDashboardStats);

export default router;
