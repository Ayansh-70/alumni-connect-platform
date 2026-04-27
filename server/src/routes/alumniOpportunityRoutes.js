import { Router } from 'express';
import {
  closePostedOpportunity,
  createAlumniOpportunity,
  fetchAlumniOpportunities,
  fetchAlumniOpportunityById,
  saveOpportunityUpdate
} from '../controllers/alumniOpportunityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ALUMNI));

router.post('/', createAlumniOpportunity);
router.get('/', fetchAlumniOpportunities);
router.get('/:id', fetchAlumniOpportunityById);
router.put('/:id', saveOpportunityUpdate);
router.patch('/:id/close', closePostedOpportunity);

export default router;
