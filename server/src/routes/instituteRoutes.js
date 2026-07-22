import { Router } from 'express';
import {
  approve,
  getById,
  listInstitutes,
  listRequests,
  register,
  reject
} from '../controllers/instituteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';
import { registerLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/register', registerLimiter, register);

router.use(protect, authorize(USER_ROLES.SUPER_ADMIN));
router.get('/requests', listRequests);
router.get('/', listInstitutes);
router.get('/:id', getById);
router.patch('/:id/approve', approve);
router.patch('/:id/reject', reject);

export default router;
