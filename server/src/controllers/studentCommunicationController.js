import asyncHandler from 'express-async-handler';
import {
  getVisibleAnnouncementById,
  getVisibleAnnouncements,
  getVisibleEventById,
  getVisibleEvents
} from '../services/communicationService.js';

const fetchStudentAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await getVisibleAnnouncements(req.user);

  res.status(200).json({
    success: true,
    message: 'Announcements fetched successfully.',
    data: { announcements }
  });
});

const fetchStudentAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await getVisibleAnnouncementById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement fetched successfully.',
    data: { announcement }
  });
});

const fetchStudentEvents = asyncHandler(async (req, res) => {
  const events = await getVisibleEvents(req.user);

  res.status(200).json({
    success: true,
    message: 'Events fetched successfully.',
    data: { events }
  });
});

const fetchStudentEventById = asyncHandler(async (req, res) => {
  const event = await getVisibleEventById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event fetched successfully.',
    data: { event }
  });
});

export {
  fetchStudentAnnouncementById,
  fetchStudentAnnouncements,
  fetchStudentEventById,
  fetchStudentEvents
};
