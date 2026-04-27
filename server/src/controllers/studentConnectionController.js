import asyncHandler from 'express-async-handler';
import {
  createConnectionRequest,
  getStudentConnectionRequestById,
  getStudentConnectionRequests
} from '../services/connectionRequestService.js';

const sendConnectionRequest = asyncHandler(async (req, res) => {
  const request = await createConnectionRequest(req.user, req.body.alumniId, req.body);

  res.status(201).json({
    success: true,
    message: 'Connection request sent successfully.',
    data: { request }
  });
});

const fetchStudentConnections = asyncHandler(async (req, res) => {
  const requests = await getStudentConnectionRequests(req.user);

  res.status(200).json({
    success: true,
    message: 'Student connection requests fetched successfully.',
    data: { requests }
  });
});

const fetchStudentConnectionById = asyncHandler(async (req, res) => {
  const request = await getStudentConnectionRequestById(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Connection request fetched successfully.',
    data: { request }
  });
});

export { fetchStudentConnectionById, fetchStudentConnections, sendConnectionRequest };
