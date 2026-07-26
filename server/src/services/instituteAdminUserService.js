import mongoose from 'mongoose';
import User, { USER_ROLES, USER_STATUSES } from '../models/User.js';
import { getFrontendUrl } from '../utils/urlBuilder.js';
import emailService from './email/emailService.js';

const MANAGEABLE_ROLES = [USER_ROLES.STUDENT, USER_ROLES.ALUMNI];
const MANAGEABLE_STATUSES = [
  USER_STATUSES.ACTIVE,
  USER_STATUSES.INACTIVE,
  USER_STATUSES.BLOCKED
];

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
};

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const ensureInstituteAdminContext = (adminUser) => {
  if (!adminUser?.institute) {
    throw buildError('Institute admin is not linked to an institute.', 403);
  }
};

const ensureValidUserId = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw buildError('Invalid user ID.', 400);
  }
};

const validateCreateUserInput = ({ name, email, password, role }) => {
  if (!name || !String(name).trim()) {
    throw buildError('Name is required.');
  }

  if (!email || !String(email).trim()) {
    throw buildError('Email is required.');
  }

  if (!password || !String(password).trim()) {
    throw buildError('Password is required.');
  }

  if (String(password).trim().length < 6) {
    throw buildError('Password must be at least 6 characters.');
  }

  if (!MANAGEABLE_ROLES.includes(role)) {
    throw buildError('Invalid role provided.');
  }
};

const createInstituteUser = async (adminUser, payload, role) => {
  ensureInstituteAdminContext(adminUser);
  validateCreateUserInput({ ...payload, role });

  const normalizedEmail = normalizeEmail(payload.email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw buildError('User already exists with this email.', 409);
  }

  const user = await User.create({
    name: payload.name.trim(),
    email: normalizedEmail,
    password: payload.password.trim(),
    role,
    institute: adminUser.institute,
    status: USER_STATUSES.ACTIVE,
    mustChangePassword: true
  });

  // Populate institute name for the email
  const userWithInstitute = await User.findById(user._id).populate('institute', 'name');
  
  const loginUrl = getFrontendUrl('login');
  
  try {
    await emailService.sendWelcomeEmail(userWithInstitute, payload.password.trim(), loginUrl);
  } catch (error) {
    console.error(`Failed to send welcome email to ${normalizedEmail}:`, error);
    // Non-fatal error, continue user creation
  }

  return sanitizeUser(user);
};

const parsePagination = (query = {}) => {
  const page = Math.max(Number.parseInt(query.page || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '10', 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { limit, page, skip };
};

const listInstituteUsersByRole = async (adminUser, role, query) => {
  ensureInstituteAdminContext(adminUser);

  if (!MANAGEABLE_ROLES.includes(role)) {
    throw buildError('Invalid role provided.');
  }

  const { page, limit, skip } = parsePagination(query);
  const filter = {
    institute: adminUser.institute,
    role
  };

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);

  return {
    users: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  };
};

const updateInstituteUserStatus = async (adminUser, userId, status) => {
  ensureInstituteAdminContext(adminUser);
  ensureValidUserId(userId);

  if (!status || !MANAGEABLE_STATUSES.includes(status)) {
    throw buildError('Invalid status provided.');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw buildError('User not found.', 404);
  }

  if (!MANAGEABLE_ROLES.includes(user.role)) {
    throw buildError('Institute admin can only manage student and alumni users.', 403);
  }

  if (!user.institute || user.institute.toString() !== adminUser.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage users from your own institute.', 403);
  }

  user.status = status;
  await user.save();

  return sanitizeUser(user);
};

export { createInstituteUser, listInstituteUsersByRole, updateInstituteUserStatus };
