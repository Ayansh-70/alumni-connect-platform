import asyncHandler from 'express-async-handler';
import {
  cancelStudentGuidanceRequest,
  createGuidanceRequest,
  getStudentGuidanceRequestById,
  getStudentGuidanceRequests
} from '../services/guidanceRequestService.js';

const createStudentGuidanceRequest = asyncHandler(async (req, res) => {
  const request = await createGuidanceRequest(req.user, req.body);

  res.status(201).json({
    success: true,
    message: 'Guidance request sent successfully.',
    data: { request }
  });
});

const fetchStudentGuidanceRequests = asyncHandler(async (req, res) => {
  const requests = await getStudentGuidanceRequests(req.user);

  res.status(200).json({
    success: true,
    message: 'Student guidance requests fetched successfully.',
    data: { requests }
  });
});

const fetchStudentGuidanceRequestById = asyncHandler(async (req, res) => {
  const request = await getStudentGuidanceRequestById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Guidance request fetched successfully.',
    data: { request }
  });
});

const cancelGuidanceRequest = asyncHandler(async (req, res) => {
  const request = await cancelStudentGuidanceRequest(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Guidance request cancelled successfully.',
    data: { request }
  });
});

export {
  cancelGuidanceRequest,
  createStudentGuidanceRequest,
  fetchStudentGuidanceRequestById,
  fetchStudentGuidanceRequests
};
