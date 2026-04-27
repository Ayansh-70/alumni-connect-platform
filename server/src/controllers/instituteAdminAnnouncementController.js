import asyncHandler from 'express-async-handler';
import {
  createAnnouncement,
  deleteAnnouncement,
  getInstituteAnnouncementById,
  getInstituteAnnouncements,
  toggleAnnouncementStatus,
  updateAnnouncement
} from '../services/communicationService.js';

const createInstituteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await createAnnouncement(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Announcement created successfully.',
    data: { announcement }
  });
});

const fetchInstituteAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await getInstituteAnnouncements(req.user);

  res.status(200).json({
    success: true,
    message: 'Announcements fetched successfully.',
    data: { announcements }
  });
});

const fetchInstituteAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await getInstituteAnnouncementById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement fetched successfully.',
    data: { announcement }
  });
});

const saveInstituteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await updateAnnouncement(req.user, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Announcement updated successfully.',
    data: { announcement }
  });
});

const toggleInstituteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await toggleAnnouncementStatus(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement status updated successfully.',
    data: { announcement }
  });
});

const removeInstituteAnnouncement = asyncHandler(async (req, res) => {
  await deleteAnnouncement(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement deleted successfully.'
  });
});

export {
  createInstituteAnnouncement,
  fetchInstituteAnnouncementById,
  fetchInstituteAnnouncements,
  removeInstituteAnnouncement,
  saveInstituteAnnouncement,
  toggleInstituteAnnouncement
};
