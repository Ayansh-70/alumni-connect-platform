import { Router } from 'express';
import {
  createInstituteEvent,
  fetchInstituteEventById,
  fetchInstituteEvents,
  removeInstituteEvent,
  saveInstituteEvent,
  toggleInstituteEvent
} from '../controllers/instituteAdminEventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.INSTITUTE_ADMIN));

router.post('/', createInstituteEvent);
router.get('/', fetchInstituteEvents);
router.get('/:id', fetchInstituteEventById);
router.put('/:id', saveInstituteEvent);
router.patch('/:id/toggle-status', toggleInstituteEvent);
router.delete('/:id', removeInstituteEvent);

export default router;
