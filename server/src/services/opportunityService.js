import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from '../models/Notification.js';
import Opportunity, {
  OPPORTUNITY_MODES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TYPES
} from '../models/Opportunity.js';
import { createNotification } from './notificationService.js';
import { USER_ROLES } from '../models/User.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureRoleAndInstitute = (user, role) => {
  if (!user) {
    throw buildError('Authenticated user is required.', 401);
  }

  if (user.role !== role) {
    throw buildError('Unauthorized access.', 403);
  }

  if (!user.institute) {
    throw buildError('Authenticated user is not linked to an institute.', 403);
  }
};

const ensureValidObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw buildError('Invalid opportunity ID.', 400);
  }
};

const isValidUrl = (value) => {
  try {
    const parsed = new URL(String(value));
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};

const splitCsv = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const validateOpportunityPayload = (payload = {}) => {
  const requiredFields = [
    'title',
    'description',
    'type',
    'company',
    'role',
    'location',
    'mode',
    'eligibility',
    'applicationLink',
    'deadline'
  ];

  for (const fieldName of requiredFields) {
    if (payload[fieldName] === undefined || payload[fieldName] === null || String(payload[fieldName]).trim() === '') {
      throw buildError(`${fieldName} is required.`, 400);
    }
  }

  if (!Object.values(OPPORTUNITY_TYPES).includes(payload.type)) {
    throw buildError('Invalid opportunity type.', 400);
  }

  if (!Object.values(OPPORTUNITY_MODES).includes(payload.mode)) {
    throw buildError('Invalid opportunity mode.', 400);
  }

  if (!isValidUrl(payload.applicationLink)) {
    throw buildError('Invalid applicationLink.', 400);
  }

  const parsedDeadline = new Date(payload.deadline);

  if (Number.isNaN(parsedDeadline.getTime())) {
    throw buildError('Invalid deadline.', 400);
  }
};

const normalizeOpportunityPayload = (payload) => {
  validateOpportunityPayload(payload);

  return {
    title: String(payload.title).trim(),
    description: String(payload.description).trim(),
    type: payload.type,
    company: String(payload.company).trim(),
    role: String(payload.role).trim(),
    location: String(payload.location).trim(),
    mode: payload.mode,
    eligibility: String(payload.eligibility).trim(),
    skillsRequired: Array.isArray(payload.skillsRequired)
      ? payload.skillsRequired.map((item) => String(item).trim()).filter(Boolean)
      : splitCsv(payload.skillsRequired),
    applicationLink: String(payload.applicationLink).trim(),
    deadline: new Date(payload.deadline)
  };
};

const sanitizeOpportunity = (opportunity) => {
  const postedBy = opportunity.postedBy
    ? {
        _id: opportunity.postedBy._id,
        name: opportunity.postedBy.name,
        email: opportunity.postedBy.email
      }
    : null;

  const approvedBy = opportunity.approvedBy
    ? {
        _id: opportunity.approvedBy._id,
        name: opportunity.approvedBy.name,
        email: opportunity.approvedBy.email
      }
    : null;

  return {
    _id: opportunity._id,
    title: opportunity.title,
    description: opportunity.description,
    type: opportunity.type,
    company: opportunity.company,
    role: opportunity.role,
    location: opportunity.location,
    mode: opportunity.mode,
    eligibility: opportunity.eligibility,
    skillsRequired: opportunity.skillsRequired,
    applicationLink: opportunity.applicationLink,
    deadline: opportunity.deadline,
    status: opportunity.status,
    rejectionReason: opportunity.rejectionReason,
    approvedAt: opportunity.approvedAt,
    createdAt: opportunity.createdAt,
    updatedAt: opportunity.updatedAt,
    postedBy,
    approvedBy
  };
};

const buildPopulate = () => [
  { path: 'postedBy', select: 'name email' },
  { path: 'approvedBy', select: 'name email' }
];

const getAlumniOwnedOpportunity = async (alumniUser, opportunityId) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);
  ensureValidObjectId(opportunityId);

  const opportunity = await Opportunity.findOne({
    _id: opportunityId,
    postedBy: alumniUser._id,
    institute: alumniUser.institute
  });

  if (!opportunity) {
    throw buildError('Opportunity not found.', 404);
  }

  return opportunity;
};

const getInstituteScopedOpportunity = async (adminUser, opportunityId) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);
  ensureValidObjectId(opportunityId);

  const opportunity = await Opportunity.findById(opportunityId);

  if (!opportunity) {
    throw buildError('Opportunity not found.', 404);
  }

  if (!opportunity.institute || opportunity.institute.toString() !== adminUser.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage opportunities from your own institute.', 403);
  }

  return opportunity;
};

const getStudentVisibleOpportunityEntity = async (studentUser, opportunityId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  ensureValidObjectId(opportunityId);

  const opportunity = await Opportunity.findById(opportunityId);

  if (!opportunity) {
    throw buildError('Opportunity not found.', 404);
  }

  if (
    !opportunity.institute ||
    opportunity.institute.toString() !== studentUser.institute.toString() ||
    opportunity.status !== OPPORTUNITY_STATUSES.APPROVED
  ) {
    throw buildError('Approved opportunity not found in your institute.', 404);
  }

  return opportunity;
};

const createOpportunity = async (alumniUser, payload) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);
  const normalizedPayload = normalizeOpportunityPayload(payload);

  const opportunity = await Opportunity.create({
    ...normalizedPayload,
    postedBy: alumniUser._id,
    institute: alumniUser.institute,
    status: OPPORTUNITY_STATUSES.PENDING
  });

  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const getAlumniOpportunities = async (alumniUser) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);

  const opportunities = await Opportunity.find({
    postedBy: alumniUser._id,
    institute: alumniUser.institute
  })
    .populate(buildPopulate())
    .sort({ createdAt: -1 });

  return opportunities.map(sanitizeOpportunity);
};

const getAlumniOpportunityById = async (alumniUser, opportunityId) => {
  const opportunity = await getAlumniOwnedOpportunity(alumniUser, opportunityId);
  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const updateOpportunity = async (alumniUser, opportunityId, payload) => {
  const opportunity = await getAlumniOwnedOpportunity(alumniUser, opportunityId);

  if (![OPPORTUNITY_STATUSES.PENDING, OPPORTUNITY_STATUSES.REJECTED].includes(opportunity.status)) {
    throw buildError('Only pending or rejected opportunities can be updated.', 400);
  }

  const normalizedPayload = normalizeOpportunityPayload(payload);

  Object.assign(opportunity, normalizedPayload);
  opportunity.status = OPPORTUNITY_STATUSES.PENDING;
  opportunity.rejectionReason = '';
  opportunity.approvedBy = null;
  opportunity.approvedAt = null;
  await opportunity.save();

  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const closeOpportunity = async (alumniUser, opportunityId) => {
  const opportunity = await getAlumniOwnedOpportunity(alumniUser, opportunityId);

  if (opportunity.status !== OPPORTUNITY_STATUSES.APPROVED) {
    throw buildError('Only approved opportunities can be closed.', 400);
  }

  opportunity.status = OPPORTUNITY_STATUSES.CLOSED;
  await opportunity.save();

  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const getInstituteAdminPendingOpportunities = async (adminUser) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);

  const opportunities = await Opportunity.find({
    institute: adminUser.institute,
    status: OPPORTUNITY_STATUSES.PENDING
  })
    .populate(buildPopulate())
    .sort({ createdAt: -1 });

  return opportunities.map(sanitizeOpportunity);
};

const getInstituteAdminOpportunities = async (adminUser) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);

  const opportunities = await Opportunity.find({
    institute: adminUser.institute
  })
    .populate(buildPopulate())
    .sort({ createdAt: -1 });

  return opportunities.map(sanitizeOpportunity);
};

const getInstituteAdminOpportunityById = async (adminUser, opportunityId) => {
  const opportunity = await getInstituteScopedOpportunity(adminUser, opportunityId);
  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const approveOpportunity = async (adminUser, opportunityId) => {
  const opportunity = await getInstituteScopedOpportunity(adminUser, opportunityId);

  if (opportunity.status !== OPPORTUNITY_STATUSES.PENDING) {
    throw buildError('Only pending opportunities can be approved.', 400);
  }

  opportunity.status = OPPORTUNITY_STATUSES.APPROVED;
  opportunity.rejectionReason = '';
  opportunity.approvedBy = adminUser._id;
  opportunity.approvedAt = new Date();
  await opportunity.save();

  await createNotification({
    recipient: opportunity.postedBy,
    institute: opportunity.institute,
    type: NOTIFICATION_TYPES.OPPORTUNITY_APPROVED,
    title: 'Opportunity approved',
    message: `Your opportunity "${opportunity.title}" was approved.`,
    relatedModel: 'Opportunity',
    relatedId: opportunity._id
  });

  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const rejectOpportunity = async (adminUser, opportunityId, reason) => {
  if (!reason || !String(reason).trim()) {
    throw buildError('Rejection reason is required.', 400);
  }

  const opportunity = await getInstituteScopedOpportunity(adminUser, opportunityId);

  if (opportunity.status !== OPPORTUNITY_STATUSES.PENDING) {
    throw buildError('Only pending opportunities can be rejected.', 400);
  }

  opportunity.status = OPPORTUNITY_STATUSES.REJECTED;
  opportunity.rejectionReason = String(reason).trim();
  opportunity.approvedBy = adminUser._id;
  opportunity.approvedAt = new Date();
  await opportunity.save();

  await createNotification({
    recipient: opportunity.postedBy,
    institute: opportunity.institute,
    type: NOTIFICATION_TYPES.OPPORTUNITY_REJECTED,
    title: 'Opportunity rejected',
    message: `Your opportunity "${opportunity.title}" was rejected. Reason: ${opportunity.rejectionReason}`,
    relatedModel: 'Opportunity',
    relatedId: opportunity._id
  });

  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

const getStudentOpportunities = async (studentUser) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);

  const opportunities = await Opportunity.find({
    institute: studentUser.institute,
    status: OPPORTUNITY_STATUSES.APPROVED
  })
    .populate(buildPopulate())
    .sort({ createdAt: -1 });

  return opportunities.map(sanitizeOpportunity);
};

const getStudentOpportunityById = async (studentUser, opportunityId) => {
  const opportunity = await getStudentVisibleOpportunityEntity(studentUser, opportunityId);
  const populated = await Opportunity.findById(opportunity._id).populate(buildPopulate());
  return sanitizeOpportunity(populated);
};

export {
  OPPORTUNITY_MODES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TYPES,
  approveOpportunity,
  closeOpportunity,
  createOpportunity,
  getAlumniOpportunities,
  getAlumniOpportunityById,
  getInstituteAdminOpportunities,
  getInstituteAdminOpportunityById,
  getInstituteAdminPendingOpportunities,
  getStudentOpportunities,
  getStudentOpportunityById,
  rejectOpportunity,
  updateOpportunity
};
