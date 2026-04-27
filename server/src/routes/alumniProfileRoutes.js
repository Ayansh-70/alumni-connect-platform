import { Router } from 'express';
import { fetchAlumniProfile, saveAlumniProfile } from '../controllers/alumniProfileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ALUMNI));

router.get('/profile', fetchAlumniProfile);
router.put('/profile', saveAlumniProfile);

export default router;
