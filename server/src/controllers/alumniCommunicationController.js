import asyncHandler from 'express-async-handler';
import {
  getVisibleAnnouncementById,
  getVisibleAnnouncements,
  getVisibleEventById,
  getVisibleEvents
} from '../services/communicationService.js';

const fetchAlumniAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await getVisibleAnnouncements(req.user);

  res.status(200).json({
    success: true,
    message: 'Announcements fetched successfully.',
    data: { announcements }
  });
});

const fetchAlumniAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await getVisibleAnnouncementById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement fetched successfully.',
    data: { announcement }
  });
});

const fetchAlumniEvents = asyncHandler(async (req, res) => {
  const events = await getVisibleEvents(req.user);

  res.status(200).json({
    success: true,
    message: 'Events fetched successfully.',
    data: { events }
  });
});

const fetchAlumniEventById = asyncHandler(async (req, res) => {
  const event = await getVisibleEventById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event fetched successfully.',
    data: { event }
  });
});

export {
  fetchAlumniAnnouncementById,
  fetchAlumniAnnouncements,
  fetchAlumniEventById,
  fetchAlumniEvents
};
