import asyncHandler from 'express-async-handler';
import { getStudentProfile, upsertStudentProfile } from '../services/profileService.js';

const fetchStudentProfile = asyncHandler(async (req, res) => {
  const profile = await getStudentProfile(req.user);

  res.status(200).json({
    success: true,
    message: 'Student profile fetched successfully.',
    data: { profile }
  });
});

const saveStudentProfile = asyncHandler(async (req, res) => {
  const profile = await upsertStudentProfile(req.user, req.body);

  res.status(200).json({
    success: true,
    message: 'Student profile saved successfully.',
    data: { profile }
  });
});

export { fetchStudentProfile, saveStudentProfile };
