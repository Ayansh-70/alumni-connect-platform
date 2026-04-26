import asyncHandler from 'express-async-handler';
import { USER_ROLES } from '../models/User.js';
import {
  createInstituteUser,
  listInstituteUsersByRole,
  updateInstituteUserStatus
} from '../services/instituteAdminUserService.js';

const createStudent = asyncHandler(async (req, res) => {
  const user = await createInstituteUser(req.user, req.body, USER_ROLES.STUDENT);

  res.status(201).json({
    success: true,
    message: 'Student user created successfully.',
    data: { user }
  });
});

const createAlumni = asyncHandler(async (req, res) => {
  const user = await createInstituteUser(req.user, req.body, USER_ROLES.ALUMNI);

  res.status(201).json({
    success: true,
    message: 'Alumni user created successfully.',
    data: { user }
  });
});

const listStudents = asyncHandler(async (req, res) => {
  const result = await listInstituteUsersByRole(req.user, USER_ROLES.STUDENT, req.query);

  res.status(200).json({
    success: true,
    message: 'Students fetched successfully.',
    data: result
  });
});

const listAlumni = asyncHandler(async (req, res) => {
  const result = await listInstituteUsersByRole(req.user, USER_ROLES.ALUMNI, req.query);

  res.status(200).json({
    success: true,
    message: 'Alumni fetched successfully.',
    data: result
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const user = await updateInstituteUserStatus(req.user, req.params.id, req.body.status);

  res.status(200).json({
    success: true,
    message: 'User status updated successfully.',
    data: { user }
  });
});

export { createAlumni, createStudent, listAlumni, listStudents, updateStatus };
