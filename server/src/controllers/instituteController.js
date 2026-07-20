import asyncHandler from 'express-async-handler';
import {
  approveInstitute,
  getInstituteById,
  getInstituteRequests,
  getInstitutes,
  registerInstitute,
  rejectInstitute
} from '../services/instituteService.js';

const register = asyncHandler(async (req, res) => {
  const institute = await registerInstitute(req.body);

  res.status(201).json({
    success: true,
    message: 'Institute registration submitted successfully. Your application is awaiting approval.',
    data: { 
      applicationStatus: institute.status 
    }
  });
});

const listRequests = asyncHandler(async (req, res) => {
  const institutes = await getInstituteRequests();

  res.status(200).json({
    success: true,
    message: 'Pending institute requests fetched successfully.',
    data: { institutes }
  });
});

const listInstitutes = asyncHandler(async (req, res) => {
  const institutes = await getInstitutes();

  res.status(200).json({
    success: true,
    message: 'Institutes fetched successfully.',
    data: { institutes }
  });
});

const getById = asyncHandler(async (req, res) => {
  const institute = await getInstituteById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Institute fetched successfully.',
    data: { institute }
  });
});

const approve = asyncHandler(async (req, res) => {
  const institute = await approveInstitute(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Institute approved successfully.',
    data: { institute }
  });
});

const reject = asyncHandler(async (req, res) => {
  const institute = await rejectInstitute(req.params.id, req.body.rejectionReason);

  res.status(200).json({
    success: true,
    message: 'Institute rejected successfully.',
    data: { institute }
  });
});

export { approve, getById, listInstitutes, listRequests, register, reject };
