import { Router } from 'express';
import { fetchStudentOpportunities, fetchStudentOpportunityById } from '../controllers/studentOpportunityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.STUDENT));

router.get('/', fetchStudentOpportunities);
router.get('/:id', fetchStudentOpportunityById);

export default router;
