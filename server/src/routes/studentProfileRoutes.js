import { Router } from 'express';
import { fetchStudentProfile, saveStudentProfile } from '../controllers/studentProfileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.STUDENT));

router.get('/profile', fetchStudentProfile);
router.put('/profile', saveStudentProfile);

export default router;
