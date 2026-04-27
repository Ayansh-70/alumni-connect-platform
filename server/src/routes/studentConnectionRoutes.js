import { Router } from 'express';
import {
  fetchStudentConnectionById,
  fetchStudentConnections,
  sendConnectionRequest
} from '../controllers/studentConnectionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.STUDENT));

router.post('/request', sendConnectionRequest);
router.get('/', fetchStudentConnections);
router.get('/:id', fetchStudentConnectionById);

export default router;
