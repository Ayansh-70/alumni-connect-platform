import { Router } from 'express';
import { fetchAlumniAnnouncementById, fetchAlumniAnnouncements } from '../controllers/alumniCommunicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ALUMNI));

router.get('/', fetchAlumniAnnouncements);
router.get('/:id', fetchAlumniAnnouncementById);

export default router;
