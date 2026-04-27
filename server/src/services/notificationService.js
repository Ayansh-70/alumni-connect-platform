import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureAuthenticatedUser = (user) => {
  if (!user?._id) {
    throw buildError('Authenticated user is required.', 401);
  }
};

const ensureValidNotificationId = (notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw buildError('Invalid notification ID.', 400);
  }
};

const sanitizeNotification = (notification) => ({
  _id: notification._id,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  relatedModel: notification.relatedModel,
  relatedId: notification.relatedId,
  isRead: notification.isRead,
  createdAt: notification.createdAt,
  updatedAt: notification.updatedAt
});

const createNotification = async ({
  recipient,
  institute,
  type,
  title,
  message,
  relatedModel = '',
  relatedId = null
}) => {
  if (!recipient || !institute || !type || !title || !message) {
    throw buildError('Notification payload is incomplete.', 400);
  }

  const notification = await Notification.create({
    recipient,
    institute,
    type,
    title,
    message,
    relatedModel,
    relatedId
  });

  return sanitizeNotification(notification);
};

const createBulkNotifications = async (notifications = []) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  const payloads = notifications.filter(
    (item) => item?.recipient && item?.institute && item?.type && item?.title && item?.message
  );

  if (payloads.length === 0) {
    return [];
  }

  const inserted = await Notification.insertMany(payloads, { ordered: false });
  return inserted.map(sanitizeNotification);
};

const getNotifications = async (user) => {
  ensureAuthenticatedUser(user);

  const notifications = await Notification.find({ recipient: user._id }).sort({ createdAt: -1 });
  return notifications.map(sanitizeNotification);
};

const getUnreadNotificationCount = async (user) => {
  ensureAuthenticatedUser(user);

  const count = await Notification.countDocuments({
    recipient: user._id,
    isRead: false
  });

  return count;
};

const getOwnedNotification = async (user, notificationId) => {
  ensureAuthenticatedUser(user);
  ensureValidNotificationId(notificationId);

  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: user._id
  });

  if (!notification) {
    throw buildError('Notification not found.', 404);
  }

  return notification;
};

const markNotificationAsRead = async (user, notificationId) => {
  const notification = await getOwnedNotification(user, notificationId);
  notification.isRead = true;
  await notification.save();
  return sanitizeNotification(notification);
};

const markAllNotificationsAsRead = async (user) => {
  ensureAuthenticatedUser(user);

  await Notification.updateMany(
    {
      recipient: user._id,
      isRead: false
    },
    {
      $set: { isRead: true }
    }
  );
};

const deleteNotification = async (user, notificationId) => {
  const notification = await getOwnedNotification(user, notificationId);
  await notification.deleteOne();
};

export {
  createBulkNotifications,
  createNotification,
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead
};
