import asyncHandler from 'express-async-handler';
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../services/notificationService.js';

const fetchNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotifications(req.user);

  res.status(200).json({
    success: true,
    message: 'Notifications fetched successfully.',
    data: { notifications }
  });
});

const fetchUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadNotificationCount(req.user);

  res.status(200).json({
    success: true,
    message: 'Unread notification count fetched successfully.',
    data: { unreadCount }
  });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read successfully.',
    data: { notification }
  });
});

const markReadAll = asyncHandler(async (req, res) => {
  await markAllNotificationsAsRead(req.user);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read successfully.'
  });
});

const removeNotification = asyncHandler(async (req, res) => {
  await deleteNotification(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully.'
  });
});

export { fetchNotifications, fetchUnreadCount, markRead, markReadAll, removeNotification };
