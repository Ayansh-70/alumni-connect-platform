import asyncHandler from 'express-async-handler';
import { getStudentVisibleAlumniDetail, searchStudentVisibleAlumni } from '../services/profileService.js';

const searchAlumni = asyncHandler(async (req, res) => {
  const alumni = await searchStudentVisibleAlumni(req.user, req.query);

  res.status(200).json({
    success: true,
    message: 'Verified alumni fetched successfully.',
    data: { alumni }
  });
});

const fetchAlumniDetail = asyncHandler(async (req, res) => {
  const alumni = await getStudentVisibleAlumniDetail(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Verified alumni profile fetched successfully.',
    data: { alumni }
  });
});

export { fetchAlumniDetail, searchAlumni };
