import asyncHandler from 'express-async-handler';
import { getAlumniProfile, upsertAlumniProfile } from '../services/profileService.js';

const fetchAlumniProfile = asyncHandler(async (req, res) => {
  const profile = await getAlumniProfile(req.user);

  res.status(200).json({
    success: true,
    message: 'Alumni profile fetched successfully.',
    data: { profile }
  });
});

const saveAlumniProfile = asyncHandler(async (req, res) => {
  const profile = await upsertAlumniProfile(req.user, req.body);

  res.status(200).json({
    success: true,
    message: 'Alumni profile saved successfully.',
    data: { profile }
  });
});

export { fetchAlumniProfile, saveAlumniProfile };
