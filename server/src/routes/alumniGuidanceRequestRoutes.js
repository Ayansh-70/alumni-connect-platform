import { Router } from 'express';
import {
  acceptGuidanceRequest,
  completeGuidanceRequest,
  fetchAlumniGuidanceRequestById,
  fetchAlumniGuidanceRequests,
  rejectGuidanceRequest
} from '../controllers/alumniGuidanceRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ALUMNI));

router.get('/', fetchAlumniGuidanceRequests);
router.get('/:id', fetchAlumniGuidanceRequestById);
router.patch('/:id/accept', acceptGuidanceRequest);
router.patch('/:id/reject', rejectGuidanceRequest);
router.patch('/:id/complete', completeGuidanceRequest);

export default router;
