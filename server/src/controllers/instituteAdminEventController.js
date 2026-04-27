import asyncHandler from 'express-async-handler';
import {
  createEvent,
  deleteEvent,
  getInstituteEventById,
  getInstituteEvents,
  toggleEventStatus,
  updateEvent
} from '../services/communicationService.js';

const createInstituteEvent = asyncHandler(async (req, res) => {
  const event = await createEvent(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Event created successfully.',
    data: { event }
  });
});

const fetchInstituteEvents = asyncHandler(async (req, res) => {
  const events = await getInstituteEvents(req.user);

  res.status(200).json({
    success: true,
    message: 'Events fetched successfully.',
    data: { events }
  });
});

const fetchInstituteEventById = asyncHandler(async (req, res) => {
  const event = await getInstituteEventById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event fetched successfully.',
    data: { event }
  });
});

const saveInstituteEvent = asyncHandler(async (req, res) => {
  const event = await updateEvent(req.user, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Event updated successfully.',
    data: { event }
  });
});

const toggleInstituteEvent = asyncHandler(async (req, res) => {
  const event = await toggleEventStatus(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event status updated successfully.',
    data: { event }
  });
});

const removeInstituteEvent = asyncHandler(async (req, res) => {
  await deleteEvent(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully.'
  });
});

export {
  createInstituteEvent,
  fetchInstituteEventById,
  fetchInstituteEvents,
  removeInstituteEvent,
  saveInstituteEvent,
  toggleInstituteEvent
};
