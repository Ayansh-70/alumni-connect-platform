import { Router } from 'express';
import {
  fetchAllAlumniProfiles,
  fetchPendingAlumniProfiles,
  rejectProfile,
  verifyProfile
} from '../controllers/instituteAdminAlumniProfileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.INSTITUTE_ADMIN));

router.get('/pending', fetchPendingAlumniProfiles);
router.get('/', fetchAllAlumniProfiles);
router.patch('/:id/verify', verifyProfile);
router.patch('/:id/reject', rejectProfile);

export default router;
