import asyncHandler from 'express-async-handler';
import {
  getAlumniGuidanceRequestById,
  getAlumniGuidanceRequests,
  updateGuidanceRequestAsAlumni
} from '../services/guidanceRequestService.js';

const fetchAlumniGuidanceRequests = asyncHandler(async (req, res) => {
  const requests = await getAlumniGuidanceRequests(req.user);

  res.status(200).json({
    success: true,
    message: 'Guidance requests fetched successfully.',
    data: { requests }
  });
});

const fetchAlumniGuidanceRequestById = asyncHandler(async (req, res) => {
  const request = await getAlumniGuidanceRequestById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Guidance request fetched successfully.',
    data: { request }
  });
});

const acceptGuidanceRequest = asyncHandler(async (req, res) => {
  const request = await updateGuidanceRequestAsAlumni(req.user, req.params.id, 'accept', req.body.responseMessage);

  res.status(200).json({
    success: true,
    message: 'Guidance request accepted successfully.',
    data: { request }
  });
});

const rejectGuidanceRequest = asyncHandler(async (req, res) => {
  const request = await updateGuidanceRequestAsAlumni(req.user, req.params.id, 'reject', req.body.responseMessage);

  res.status(200).json({
    success: true,
    message: 'Guidance request rejected successfully.',
    data: { request }
  });
});

const completeGuidanceRequest = asyncHandler(async (req, res) => {
  const request = await updateGuidanceRequestAsAlumni(req.user, req.params.id, 'complete', req.body.responseMessage);

  res.status(200).json({
    success: true,
    message: 'Guidance request marked as completed successfully.',
    data: { request }
  });
});

export {
  acceptGuidanceRequest,
  completeGuidanceRequest,
  fetchAlumniGuidanceRequestById,
  fetchAlumniGuidanceRequests,
  rejectGuidanceRequest
};
