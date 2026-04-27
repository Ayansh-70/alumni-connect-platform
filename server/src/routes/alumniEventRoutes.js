import { Router } from 'express';
import { fetchAlumniEventById, fetchAlumniEvents } from '../controllers/alumniCommunicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.ALUMNI));

router.get('/', fetchAlumniEvents);
router.get('/:id', fetchAlumniEventById);

export default router;
