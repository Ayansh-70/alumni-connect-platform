import mongoose from 'mongoose';
import Announcement, { ANNOUNCEMENT_AUDIENCES, ANNOUNCEMENT_CATEGORIES } from '../models/Announcement.js';
import Event, { EVENT_AUDIENCES, EVENT_MODES, EVENT_TYPES } from '../models/Event.js';
import { NOTIFICATION_TYPES } from '../models/Notification.js';
import User, { USER_ROLES, USER_STATUSES } from '../models/User.js';
import { createBulkNotifications } from './notificationService.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureRoleAndInstitute = (user, role) => {
  if (!user) {
    throw buildError('Authenticated user is required.', 401);
  }

  if (user.role !== role) {
    throw buildError('Unauthorized access.', 403);
  }

  if (!user.institute) {
    throw buildError('Authenticated user is not linked to an institute.', 403);
  }
};

const ensureValidObjectId = (value, label) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw buildError(`Invalid ${label}.`, 400);
  }
};

const isValidUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    const parsed = new URL(String(value));
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};

const validateAnnouncementPayload = (payload = {}) => {
  if (!payload.title || !String(payload.title).trim()) {
    throw buildError('title is required.', 400);
  }

  if (!payload.message || !String(payload.message).trim()) {
    throw buildError('message is required.', 400);
  }

  if (!Object.values(ANNOUNCEMENT_CATEGORIES).includes(payload.category)) {
    throw buildError('Invalid category.', 400);
  }

  if (!Object.values(ANNOUNCEMENT_AUDIENCES).includes(payload.audience)) {
    throw buildError('Invalid audience.', 400);
  }
};

const validateEventPayload = (payload = {}) => {
  const requiredFields = ['title', 'description', 'eventType', 'date', 'startTime', 'endTime', 'location', 'mode', 'audience'];

  for (const fieldName of requiredFields) {
    if (payload[fieldName] === undefined || payload[fieldName] === null || String(payload[fieldName]).trim() === '') {
      throw buildError(`${fieldName} is required.`, 400);
    }
  }

  if (!Object.values(EVENT_TYPES).includes(payload.eventType)) {
    throw buildError('Invalid event type.', 400);
  }

  if (!Object.values(EVENT_MODES).includes(payload.mode)) {
    throw buildError('Invalid mode.', 400);
  }

  if (!Object.values(EVENT_AUDIENCES).includes(payload.audience)) {
    throw buildError('Invalid audience.', 400);
  }

  const parsedDate = new Date(payload.date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw buildError('Invalid date.', 400);
  }

  if (!isValidUrl(payload.meetingLink)) {
    throw buildError('Invalid meetingLink.', 400);
  }
};

const normalizeAnnouncementPayload = (payload) => {
  validateAnnouncementPayload(payload);

  return {
    title: String(payload.title).trim(),
    message: String(payload.message).trim(),
    category: payload.category,
    audience: payload.audience
  };
};

const normalizeEventPayload = (payload) => {
  validateEventPayload(payload);

  return {
    title: String(payload.title).trim(),
    description: String(payload.description).trim(),
    eventType: payload.eventType,
    date: new Date(payload.date),
    startTime: String(payload.startTime).trim(),
    endTime: String(payload.endTime).trim(),
    location: String(payload.location).trim(),
    mode: payload.mode,
    meetingLink: String(payload.meetingLink || '').trim(),
    audience: payload.audience
  };
};

const sanitizeAnnouncement = (announcement) => ({
  _id: announcement._id,
  title: announcement.title,
  message: announcement.message,
  category: announcement.category,
  audience: announcement.audience,
  isActive: announcement.isActive,
  createdAt: announcement.createdAt,
  updatedAt: announcement.updatedAt,
  createdBy: announcement.createdBy
    ? {
        _id: announcement.createdBy._id,
        name: announcement.createdBy.name,
        email: announcement.createdBy.email
      }
    : null
});

const sanitizeEvent = (event) => ({
  _id: event._id,
  title: event.title,
  description: event.description,
  eventType: event.eventType,
  date: event.date,
  startTime: event.startTime,
  endTime: event.endTime,
  location: event.location,
  mode: event.mode,
  meetingLink: event.meetingLink,
  audience: event.audience,
  isActive: event.isActive,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
  createdBy: event.createdBy
    ? {
        _id: event.createdBy._id,
        name: event.createdBy.name,
        email: event.createdBy.email
      }
    : null
});

const adminPopulate = { path: 'createdBy', select: 'name email' };

const getInstituteScopedAnnouncement = async (adminUser, announcementId) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);
  ensureValidObjectId(announcementId, 'announcement ID');

  const announcement = await Announcement.findById(announcementId);

  if (!announcement) {
    throw buildError('Announcement not found.', 404);
  }

  if (!announcement.institute || announcement.institute.toString() !== adminUser.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage announcements from your own institute.', 403);
  }

  return announcement;
};

const getInstituteScopedEvent = async (adminUser, eventId) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);
  ensureValidObjectId(eventId, 'event ID');

  const event = await Event.findById(eventId);

  if (!event) {
    throw buildError('Event not found.', 404);
  }

  if (!event.institute || event.institute.toString() !== adminUser.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage events from your own institute.', 403);
  }

  return event;
};

const createAnnouncement = async (adminUser, payload) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);
  const normalizedPayload = normalizeAnnouncementPayload(payload);

  const announcement = await Announcement.create({
    ...normalizedPayload,
    institute: adminUser.institute,
    createdBy: adminUser._id
  });

  const recipients = await User.find({
    institute: adminUser.institute,
    role: { $in: getRecipientRolesForAudience(normalizedPayload.audience) },
    status: USER_STATUSES.ACTIVE
  }).select('_id institute');

  await createBulkNotifications(
    recipients.map((recipient) => ({
      recipient: recipient._id,
      institute: recipient.institute,
      type: NOTIFICATION_TYPES.NEW_ANNOUNCEMENT,
      title: `New announcement: ${announcement.title}`,
      message: announcement.message,
      relatedModel: 'Announcement',
      relatedId: announcement._id
    }))
  );

  const populated = await Announcement.findById(announcement._id).populate(adminPopulate);
  return sanitizeAnnouncement(populated);
};

const getInstituteAnnouncements = async (adminUser) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);

  const announcements = await Announcement.find({ institute: adminUser.institute })
    .populate(adminPopulate)
    .sort({ createdAt: -1 });

  return announcements.map(sanitizeAnnouncement);
};

const getInstituteAnnouncementById = async (adminUser, announcementId) => {
  const announcement = await getInstituteScopedAnnouncement(adminUser, announcementId);
  const populated = await Announcement.findById(announcement._id).populate(adminPopulate);
  return sanitizeAnnouncement(populated);
};

const updateAnnouncement = async (adminUser, announcementId, payload) => {
  const announcement = await getInstituteScopedAnnouncement(adminUser, announcementId);
  const normalizedPayload = normalizeAnnouncementPayload(payload);

  Object.assign(announcement, normalizedPayload);
  await announcement.save();

  const populated = await Announcement.findById(announcement._id).populate(adminPopulate);
  return sanitizeAnnouncement(populated);
};

const toggleAnnouncementStatus = async (adminUser, announcementId) => {
  const announcement = await getInstituteScopedAnnouncement(adminUser, announcementId);
  announcement.isActive = !announcement.isActive;
  await announcement.save();

  const populated = await Announcement.findById(announcement._id).populate(adminPopulate);
  return sanitizeAnnouncement(populated);
};

const deleteAnnouncement = async (adminUser, announcementId) => {
  const announcement = await getInstituteScopedAnnouncement(adminUser, announcementId);
  await announcement.deleteOne();
};

const createEvent = async (adminUser, payload) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);
  const normalizedPayload = normalizeEventPayload(payload);

  const event = await Event.create({
    ...normalizedPayload,
    institute: adminUser.institute,
    createdBy: adminUser._id
  });

  const recipients = await User.find({
    institute: adminUser.institute,
    role: { $in: getRecipientRolesForAudience(normalizedPayload.audience) },
    status: USER_STATUSES.ACTIVE
  }).select('_id institute');

  await createBulkNotifications(
    recipients.map((recipient) => ({
      recipient: recipient._id,
      institute: recipient.institute,
      type: NOTIFICATION_TYPES.NEW_EVENT,
      title: `New event: ${event.title}`,
      message: `${event.eventType} scheduled on ${event.date.toLocaleDateString('en-CA')}.`,
      relatedModel: 'Event',
      relatedId: event._id
    }))
  );

  const populated = await Event.findById(event._id).populate(adminPopulate);
  return sanitizeEvent(populated);
};

const getInstituteEvents = async (adminUser) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);

  const events = await Event.find({ institute: adminUser.institute })
    .populate(adminPopulate)
    .sort({ date: 1, createdAt: -1 });

  return events.map(sanitizeEvent);
};

const getInstituteEventById = async (adminUser, eventId) => {
  const event = await getInstituteScopedEvent(adminUser, eventId);
  const populated = await Event.findById(event._id).populate(adminPopulate);
  return sanitizeEvent(populated);
};

const updateEvent = async (adminUser, eventId, payload) => {
  const event = await getInstituteScopedEvent(adminUser, eventId);
  const normalizedPayload = normalizeEventPayload(payload);

  Object.assign(event, normalizedPayload);
  await event.save();

  const populated = await Event.findById(event._id).populate(adminPopulate);
  return sanitizeEvent(populated);
};

const toggleEventStatus = async (adminUser, eventId) => {
  const event = await getInstituteScopedEvent(adminUser, eventId);
  event.isActive = !event.isActive;
  await event.save();

  const populated = await Event.findById(event._id).populate(adminPopulate);
  return sanitizeEvent(populated);
};

const deleteEvent = async (adminUser, eventId) => {
  const event = await getInstituteScopedEvent(adminUser, eventId);
  await event.deleteOne();
};

const getAudienceOptionsForRole = (role, audienceEnum) => {
  if (role === USER_ROLES.STUDENT) {
    return [audienceEnum.STUDENTS, audienceEnum.BOTH];
  }

  if (role === USER_ROLES.ALUMNI) {
    return [audienceEnum.ALUMNI, audienceEnum.BOTH];
  }

  return [];
};

const getRecipientRolesForAudience = (audience) => {
  if (audience === ANNOUNCEMENT_AUDIENCES.STUDENTS || audience === EVENT_AUDIENCES.STUDENTS) {
    return [USER_ROLES.STUDENT];
  }

  if (audience === ANNOUNCEMENT_AUDIENCES.ALUMNI || audience === EVENT_AUDIENCES.ALUMNI) {
    return [USER_ROLES.ALUMNI];
  }

  return [USER_ROLES.STUDENT, USER_ROLES.ALUMNI];
};

const getVisibleAnnouncements = async (user) => {
  ensureRoleAndInstitute(user, user.role);

  const audienceOptions = getAudienceOptionsForRole(user.role, ANNOUNCEMENT_AUDIENCES);
  const announcements = await Announcement.find({
    institute: user.institute,
    isActive: true,
    audience: { $in: audienceOptions }
  })
    .populate(adminPopulate)
    .sort({ createdAt: -1 });

  return announcements.map(sanitizeAnnouncement);
};

const getVisibleAnnouncementById = async (user, announcementId) => {
  ensureRoleAndInstitute(user, user.role);
  ensureValidObjectId(announcementId, 'announcement ID');

  const audienceOptions = getAudienceOptionsForRole(user.role, ANNOUNCEMENT_AUDIENCES);
  const announcement = await Announcement.findOne({
    _id: announcementId,
    institute: user.institute,
    isActive: true,
    audience: { $in: audienceOptions }
  }).populate(adminPopulate);

  if (!announcement) {
    throw buildError('Announcement not found.', 404);
  }

  return sanitizeAnnouncement(announcement);
};

const getVisibleEvents = async (user) => {
  ensureRoleAndInstitute(user, user.role);

  const audienceOptions = getAudienceOptionsForRole(user.role, EVENT_AUDIENCES);
  const events = await Event.find({
    institute: user.institute,
    isActive: true,
    audience: { $in: audienceOptions }
  })
    .populate(adminPopulate)
    .sort({ date: 1, createdAt: -1 });

  return events.map(sanitizeEvent);
};

const getVisibleEventById = async (user, eventId) => {
  ensureRoleAndInstitute(user, user.role);
  ensureValidObjectId(eventId, 'event ID');

  const audienceOptions = getAudienceOptionsForRole(user.role, EVENT_AUDIENCES);
  const event = await Event.findOne({
    _id: eventId,
    institute: user.institute,
    isActive: true,
    audience: { $in: audienceOptions }
  }).populate(adminPopulate);

  if (!event) {
    throw buildError('Event not found.', 404);
  }

  return sanitizeEvent(event);
};

export {
  ANNOUNCEMENT_AUDIENCES,
  ANNOUNCEMENT_CATEGORIES,
  EVENT_AUDIENCES,
  EVENT_MODES,
  EVENT_TYPES,
  createAnnouncement,
  createEvent,
  deleteAnnouncement,
  deleteEvent,
  getInstituteAnnouncementById,
  getInstituteAnnouncements,
  getInstituteEventById,
  getInstituteEvents,
  getVisibleAnnouncementById,
  getVisibleAnnouncements,
  getVisibleEventById,
  getVisibleEvents,
  toggleAnnouncementStatus,
  toggleEventStatus,
  updateAnnouncement,
  updateEvent
};
