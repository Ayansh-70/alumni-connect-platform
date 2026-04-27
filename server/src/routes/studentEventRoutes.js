import { Router } from 'express';
import { fetchStudentEventById, fetchStudentEvents } from '../controllers/studentCommunicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.STUDENT));

router.get('/', fetchStudentEvents);
router.get('/:id', fetchStudentEventById);

export default router;
