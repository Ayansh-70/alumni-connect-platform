import mongoose from 'mongoose';
import Institute, { INSTITUTE_STATUSES } from '../models/Institute.js';
import User, { USER_ROLES, USER_STATUSES } from '../models/User.js';
import { getFrontendUrl } from '../utils/urlBuilder.js';
import emailService from './email/emailService.js';

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildValidationError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeInstitutePayload = (payload) => ({
  name: payload.instituteName?.trim() || '',
  type: payload.instituteType?.trim() || '',
  email: normalizeEmail(payload.officialEmail || ''),
  phone: payload.phone?.trim() || '',
  website: payload.website?.trim() || '',
  address: payload.address?.trim() || '',
  city: payload.city?.trim() || '',
  state: payload.state?.trim() || '',
  country: payload.country?.trim() || '',
  description: payload.description?.trim() || `Registration for ${payload.instituteName?.trim() || ''}`
});

const sanitizeUserPayload = (payload) => ({
  name: payload.adminName?.trim() || '',
  designation: payload.designation?.trim() || '',
  email: normalizeEmail(payload.adminEmail || payload.officialEmail || ''),
  password: payload.password || '',
  confirmPassword: payload.confirmPassword || ''
});

const validateRegistrationInput = (institutePayload, userPayload) => {
  const requiredInstituteFields = [
    ['name', 'Institute name is required.'],
    ['email', 'Official email is required.'],
    ['phone', 'Phone number is required.'],
    ['address', 'Address is required.'],
    ['city', 'City is required.'],
    ['state', 'State is required.'],
    ['country', 'Country is required.']
  ];

  requiredInstituteFields.forEach(([field, message]) => {
    if (!institutePayload[field]) {
      throw buildValidationError(message);
    }
  });

  const requiredUserFields = [
    ['name', 'Administrator name is required.'],
    ['email', 'Administrator email is required.'],
    ['password', 'Password is required.']
  ];

  requiredUserFields.forEach(([field, message]) => {
    if (!userPayload[field]) {
      throw buildValidationError(message);
    }
  });

  if (userPayload.password.length < 6) {
    throw buildValidationError('Password must be at least 6 characters.');
  }

  if (userPayload.password !== userPayload.confirmPassword) {
    throw buildValidationError('Passwords do not match.');
  }
};

const ensureValidInstituteId = (instituteId) => {
  if (!mongoose.Types.ObjectId.isValid(instituteId)) {
    throw buildValidationError('Invalid institute ID.', 400);
  }
};

const registerInstitute = async (payload) => {
  const institutePayload = sanitizeInstitutePayload(payload);
  const userPayload = sanitizeUserPayload(payload);

  validateRegistrationInput(institutePayload, userPayload);

  const existingInstituteName = await Institute.findOne({ name: { $regex: new RegExp(`^${institutePayload.name}$`, 'i') } });
  if (existingInstituteName) {
    throw buildValidationError('An institute with this name already exists.', 409);
  }

  const existingInstituteEmail = await Institute.findOne({ email: institutePayload.email });
  if (existingInstituteEmail) {
    throw buildValidationError('An institute with this official email already exists.', 409);
  }

  const existingUser = await User.findOne({ email: userPayload.email });
  if (existingUser) {
    throw buildValidationError('A user with this email already exists.', 409);
  }

  let institute;
  try {
    institute = await Institute.create({
      ...institutePayload,
      status: INSTITUTE_STATUSES.PENDING
    });
  } catch (error) {
    throw buildValidationError(error.message, 500);
  }

  try {
    await User.create({
      name: userPayload.name,
      email: userPayload.email,
      password: userPayload.password,
      designation: userPayload.designation,
      role: USER_ROLES.INSTITUTE_ADMIN,
      status: USER_STATUSES.PENDING,
      institute: institute._id
    });
  } catch (error) {
    await Institute.findByIdAndDelete(institute._id);
    throw buildValidationError(error.message, 500);
  }

  // Send Application Received Email non-blockingly
  try {
    await emailService.sendApplicationReceivedEmail(userPayload.email, institute.name);
  } catch (err) {
    console.error('Failed to send application received email:', err);
  }

  return institute;
};

const getInstituteRequests = async () =>
  Institute.find({ status: INSTITUTE_STATUSES.PENDING }).sort({ createdAt: 1 });

const getInstitutes = async () =>
  Institute.find()
    .populate('approvedBy', 'name email role')
    .sort({ createdAt: -1 });

const getInstituteById = async (instituteId) => {
  ensureValidInstituteId(instituteId);

  const institute = await Institute.findById(instituteId).populate('approvedBy', 'name email role');

  if (!institute) {
    throw buildValidationError('Institute not found.', 404);
  }

  return institute;
};

const approveInstitute = async (instituteId, approvedByUserId) => {
  const institute = await getInstituteById(instituteId);

  if (institute.status !== INSTITUTE_STATUSES.PENDING) {
    throw buildValidationError('Only pending institute requests can be approved.', 400);
  }

  institute.status = INSTITUTE_STATUSES.APPROVED;
  institute.rejectionReason = '';
  institute.approvedBy = approvedByUserId;
  institute.approvedAt = new Date();

  await institute.save();

  // Also activate the associated admin user
  await User.updateMany(
    { institute: instituteId, role: USER_ROLES.INSTITUTE_ADMIN },
    { $set: { status: USER_STATUSES.ACTIVE } }
  );

  const adminUser = await User.findOne({ institute: instituteId, role: USER_ROLES.INSTITUTE_ADMIN });

  // Send Application Approved Email non-blockingly
  if (adminUser) {
    try {
      const loginUrl = getFrontendUrl('login');
      await emailService.sendApplicationApprovedEmail(adminUser.email, institute.name, loginUrl);
    } catch (err) {
      console.error('Failed to send application approved email:', err);
    }
  }

  return institute.populate('approvedBy', 'name email role');
};

const rejectInstitute = async (instituteId, rejectionReason) => {
  if (!rejectionReason || !rejectionReason.trim()) {
    throw buildValidationError('Rejection reason is required.', 400);
  }

  const institute = await getInstituteById(instituteId);

  if (institute.status !== INSTITUTE_STATUSES.PENDING) {
    throw buildValidationError('Only pending institute requests can be rejected.', 400);
  }

  institute.status = INSTITUTE_STATUSES.REJECTED;
  institute.rejectionReason = rejectionReason.trim();
  institute.approvedBy = null;
  institute.approvedAt = null;

  await institute.save();

  // Also reject the associated admin user
  await User.updateMany(
    { institute: instituteId, role: USER_ROLES.INSTITUTE_ADMIN },
    { $set: { status: USER_STATUSES.REJECTED } }
  );

  const adminUser = await User.findOne({ institute: instituteId, role: USER_ROLES.INSTITUTE_ADMIN });

  // Send Application Rejected Email non-blockingly
  if (adminUser) {
    try {
      await emailService.sendApplicationRejectedEmail(adminUser.email, institute.name, institute.rejectionReason);
    } catch (err) {
      console.error('Failed to send application rejected email:', err);
    }
  }

  return institute;
};

export {
  approveInstitute,
  getInstituteById,
  getInstituteRequests,
  getInstitutes,
  registerInstitute,
  rejectInstitute
};
