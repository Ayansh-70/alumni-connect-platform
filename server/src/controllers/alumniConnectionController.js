import asyncHandler from 'express-async-handler';
import {
  CONNECTION_REQUEST_STATUSES,
  getAlumniReceivedConnectionRequests,
  updateConnectionRequestStatus
} from '../services/connectionRequestService.js';

const fetchReceivedConnectionRequests = asyncHandler(async (req, res) => {
  const requests = await getAlumniReceivedConnectionRequests(req.user);

  res.status(200).json({
    success: true,
    message: 'Received connection requests fetched successfully.',
    data: { requests }
  });
});

const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const request = await updateConnectionRequestStatus(req.user, req.params.id, CONNECTION_REQUEST_STATUSES.ACCEPTED);

  res.status(200).json({
    success: true,
    message: 'Connection request accepted successfully.',
    data: { request }
  });
});

const rejectConnectionRequest = asyncHandler(async (req, res) => {
  const request = await updateConnectionRequestStatus(req.user, req.params.id, CONNECTION_REQUEST_STATUSES.REJECTED);

  res.status(200).json({
    success: true,
    message: 'Connection request rejected successfully.',
    data: { request }
  });
});

export { acceptConnectionRequest, fetchReceivedConnectionRequests, rejectConnectionRequest };
