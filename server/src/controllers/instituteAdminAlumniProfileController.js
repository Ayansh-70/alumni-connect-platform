import asyncHandler from 'express-async-handler';
import {
  getPendingInstituteAlumniProfiles,
  listInstituteAlumniProfiles,
  rejectAlumniProfile,
  verifyAlumniProfile
} from '../services/profileService.js';

const fetchPendingAlumniProfiles = asyncHandler(async (req, res) => {
  const profiles = await getPendingInstituteAlumniProfiles(req.user);

  res.status(200).json({
    success: true,
    message: 'Pending alumni profiles fetched successfully.',
    data: { profiles }
  });
});

const fetchAllAlumniProfiles = asyncHandler(async (req, res) => {
  const profiles = await listInstituteAlumniProfiles(req.user);

  res.status(200).json({
    success: true,
    message: 'Alumni profiles fetched successfully.',
    data: { profiles }
  });
});

const verifyProfile = asyncHandler(async (req, res) => {
  const profile = await verifyAlumniProfile(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Alumni profile verified successfully.',
    data: { profile }
  });
});

const rejectProfile = asyncHandler(async (req, res) => {
  const profile = await rejectAlumniProfile(req.user, req.params.id, req.body.reason);

  res.status(200).json({
    success: true,
    message: 'Alumni profile rejected successfully.',
    data: { profile }
  });
});

export { fetchAllAlumniProfiles, fetchPendingAlumniProfiles, rejectProfile, verifyProfile };
