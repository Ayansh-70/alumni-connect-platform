import { Router } from 'express';
import {
  cancelGuidanceRequest,
  createStudentGuidanceRequest,
  fetchStudentGuidanceRequestById,
  fetchStudentGuidanceRequests
} from '../controllers/studentGuidanceRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.STUDENT));

router.post('/', createStudentGuidanceRequest);
router.get('/', fetchStudentGuidanceRequests);
router.get('/:id', fetchStudentGuidanceRequestById);
router.patch('/:id/cancel', cancelGuidanceRequest);

export default router;
