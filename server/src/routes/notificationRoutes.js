import { Router } from 'express';
import {
  fetchNotifications,
  fetchUnreadCount,
  markRead,
  markReadAll,
  removeNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', fetchNotifications);
router.get('/unread-count', fetchUnreadCount);
router.patch('/read-all', markReadAll);
router.patch('/:id/read', markRead);
router.delete('/:id', removeNotification);

export default router;
