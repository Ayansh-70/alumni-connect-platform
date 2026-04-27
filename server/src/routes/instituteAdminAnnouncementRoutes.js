import { Router } from 'express';
import {
  createInstituteAnnouncement,
  fetchInstituteAnnouncementById,
  fetchInstituteAnnouncements,
  removeInstituteAnnouncement,
  saveInstituteAnnouncement,
  toggleInstituteAnnouncement
} from '../controllers/instituteAdminAnnouncementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { USER_ROLES } from '../models/User.js';

const router = Router();

router.use(protect, authorize(USER_ROLES.INSTITUTE_ADMIN));

router.post('/', createInstituteAnnouncement);
router.get('/', fetchInstituteAnnouncements);
router.get('/:id', fetchInstituteAnnouncementById);
router.put('/:id', saveInstituteAnnouncement);
router.patch('/:id/toggle-status', toggleInstituteAnnouncement);
router.delete('/:id', removeInstituteAnnouncement);

export default router;
