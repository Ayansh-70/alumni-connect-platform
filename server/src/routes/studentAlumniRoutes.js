import { Router } from 'express';
import { fetchAlumniDetail, searchAlumni } from '../controllers/studentAlumniController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.STUDENT));

router.get('/search', searchAlumni);
router.get('/:id', fetchAlumniDetail);

export default router;
