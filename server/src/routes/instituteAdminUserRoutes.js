import { Router } from 'express';
import {
  createAlumni,
  createStudent,
  listAlumni,
  listStudents,
  updateStatus
} from '../controllers/instituteAdminUserController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.INSTITUTE_ADMIN));

router.post('/students', createStudent);
router.post('/alumni', createAlumni);
router.get('/students', listStudents);
router.get('/alumni', listAlumni);
router.patch('/:id/status', updateStatus);

export default router;
