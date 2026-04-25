import mongoose from 'mongoose';
import Institute, { INSTITUTE_STATUSES } from '../models/Institute.js';

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildValidationError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeInstitutePayload = (payload) => ({
  name: payload.name.trim(),
  email: normalizeEmail(payload.email),
  phone: payload.phone.trim(),
  website: payload.website?.trim() || '',
  address: payload.address.trim(),
  city: payload.city.trim(),
  state: payload.state.trim(),
  country: payload.country.trim(),
  description: payload.description.trim()
});

const validateInstituteInput = (payload) => {
  const requiredFields = [
    ['name', 'Institute name is required.'],
    ['email', 'Institute email is required.'],
    ['phone', 'Phone number is required.'],
    ['address', 'Address is required.'],
    ['city', 'City is required.'],
    ['state', 'State is required.'],
    ['country', 'Country is required.'],
    ['description', 'Description is required.']
  ];

  requiredFields.forEach(([field, message]) => {
    if (!payload[field] || !String(payload[field]).trim()) {
      throw buildValidationError(message);
    }
  });
};

const ensureValidInstituteId = (instituteId) => {
  if (!mongoose.Types.ObjectId.isValid(instituteId)) {
    throw buildValidationError('Invalid institute ID.', 400);
  }
};

const registerInstitute = async (payload) => {
  validateInstituteInput(payload);

  const sanitizedPayload = sanitizeInstitutePayload(payload);
  const existingInstitute = await Institute.findOne({ email: sanitizedPayload.email });

  if (existingInstitute) {
    throw buildValidationError('Institute already exists with this email.', 409);
  }

  const institute = await Institute.create(sanitizedPayload);
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
