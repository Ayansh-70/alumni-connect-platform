import { Router } from 'express';
import {
  approveInstituteOpportunity,
  fetchInstituteOpportunities,
  fetchInstituteOpportunityById,
  fetchPendingOpportunities,
  rejectInstituteOpportunity
} from '../controllers/instituteAdminOpportunityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.INSTITUTE_ADMIN));

router.get('/pending', fetchPendingOpportunities);
router.get('/', fetchInstituteOpportunities);
router.get('/:id', fetchInstituteOpportunityById);
router.patch('/:id/approve', approveInstituteOpportunity);
router.patch('/:id/reject', rejectInstituteOpportunity);

export default router;
