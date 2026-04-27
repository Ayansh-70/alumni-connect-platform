import { Router } from 'express';
import {
  acceptConnectionRequest,
  fetchReceivedConnectionRequests,
  rejectConnectionRequest
} from '../controllers/alumniConnectionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ALUMNI));

router.get('/requests', fetchReceivedConnectionRequests);
router.patch('/:id/accept', acceptConnectionRequest);
router.patch('/:id/reject', rejectConnectionRequest);

export default router;
