import mongoose from 'mongoose';
import { getStudentToAlumniConnectionRequest } from './connectionRequestService.js';
import AlumniProfile, { ALUMNI_VERIFICATION_STATUSES } from '../models/AlumniProfile.js';
import { NOTIFICATION_TYPES } from '../models/Notification.js';
import StudentProfile from '../models/StudentProfile.js';
import { createNotification } from './notificationService.js';
import { USER_ROLES, USER_STATUSES } from '../models/User.js';

const buildError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (error) {
    return false;
  }
};

const splitCsv = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

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

const ensureInstituteAdminContext = (adminUser) => {
  ensureRoleAndInstitute(adminUser, USER_ROLES.INSTITUTE_ADMIN);
};

const ensureValidProfileId = (profileId) => {
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    throw buildError('Invalid profile ID.', 400);
  }
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildContainsRegex = (value) => new RegExp(escapeRegex(String(value).trim()), 'i');

const validateRequiredFields = (payload, requiredFields) => {
  for (const fieldName of requiredFields) {
    const fieldValue = payload[fieldName];

    if (fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '') {
      throw buildError(`${fieldName} is required.`, 400);
    }
  }
};

const validateProfileLinks = (payload) => {
  const urlFields = ['linkedInUrl', 'githubUrl', 'portfolioUrl'];

  for (const fieldName of urlFields) {
    if (!isValidUrl(payload[fieldName])) {
      throw buildError(`Invalid ${fieldName}.`, 400);
    }
  }
};

const normalizeStudentPayload = (payload) => {
  validateRequiredFields(payload, ['branch', 'batch', 'semester', 'rollNumber']);
  validateProfileLinks(payload);

  return {
    branch: String(payload.branch).trim(),
    batch: String(payload.batch).trim(),
    semester: String(payload.semester).trim(),
    rollNumber: String(payload.rollNumber).trim(),
    skills: Array.isArray(payload.skills) ? payload.skills.map((item) => String(item).trim()).filter(Boolean) : splitCsv(payload.skills),
    interests: Array.isArray(payload.interests)
      ? payload.interests.map((item) => String(item).trim()).filter(Boolean)
      : splitCsv(payload.interests),
    careerGoals: String(payload.careerGoals || '').trim(),
    bio: String(payload.bio || '').trim(),
    location: String(payload.location || '').trim(),
    linkedInUrl: String(payload.linkedInUrl || '').trim(),
    githubUrl: String(payload.githubUrl || '').trim(),
    portfolioUrl: String(payload.portfolioUrl || '').trim(),
    profileCompleted: true
  };
};

const normalizeAlumniPayload = (payload) => {
  validateRequiredFields(payload, ['branch', 'batch', 'currentCompany', 'currentRole', 'experienceYears']);
  validateProfileLinks(payload);

  const parsedExperienceYears = Number(payload.experienceYears);

  if (Number.isNaN(parsedExperienceYears) || parsedExperienceYears < 0) {
    throw buildError('experienceYears must be a valid non-negative number.', 400);
  }

  return {
    branch: String(payload.branch).trim(),
    batch: String(payload.batch).trim(),
    currentCompany: String(payload.currentCompany).trim(),
    currentRole: String(payload.currentRole).trim(),
    experienceYears: parsedExperienceYears,
    skills: Array.isArray(payload.skills) ? payload.skills.map((item) => String(item).trim()).filter(Boolean) : splitCsv(payload.skills),
    domain: String(payload.domain || '').trim(),
    location: String(payload.location || '').trim(),
    linkedInUrl: String(payload.linkedInUrl || '').trim(),
    githubUrl: String(payload.githubUrl || '').trim(),
    portfolioUrl: String(payload.portfolioUrl || '').trim(),
    bio: String(payload.bio || '').trim(),
    canProvideReferral: Boolean(payload.canProvideReferral),
    canMentor: Boolean(payload.canMentor),
    profileCompleted: true
  };
};

const sanitizeStudentProfile = (profile) => profile.toObject();

const sanitizeAlumniProfile = (profile) => profile.toObject();

const sanitizeStudentVisibleAlumniSummary = (profile) => ({
  _id: profile._id,
  user: {
    _id: profile.user._id,
    name: profile.user.name,
    email: profile.user.email
  },
  branch: profile.branch,
  batch: profile.batch,
  currentCompany: profile.currentCompany,
  currentRole: profile.currentRole,
  skills: profile.skills,
  domain: profile.domain,
  location: profile.location,
  canProvideReferral: profile.canProvideReferral,
  canMentor: profile.canMentor,
  verificationStatus: profile.verificationStatus
});

const sanitizeStudentVisibleAlumniDetail = (profile) => ({
  _id: profile._id,
  user: {
    _id: profile.user._id,
    name: profile.user.name,
    email: profile.user.email
  },
  branch: profile.branch,
  batch: profile.batch,
  currentCompany: profile.currentCompany,
  currentRole: profile.currentRole,
  experienceYears: profile.experienceYears,
  skills: profile.skills,
  domain: profile.domain,
  location: profile.location,
  bio: profile.bio,
  linkedInUrl: profile.linkedInUrl,
  githubUrl: profile.githubUrl,
  portfolioUrl: profile.portfolioUrl,
  canProvideReferral: profile.canProvideReferral,
  canMentor: profile.canMentor,
  verificationStatus: profile.verificationStatus
});

const getStudentProfile = async (user) => {
  ensureRoleAndInstitute(user, USER_ROLES.STUDENT);

  const profile = await StudentProfile.findOne({ user: user._id, institute: user.institute }).populate(
    'user',
    'name email role institute status'
  );

  if (!profile) {
    throw buildError('Student profile not found.', 404);
  }

  return sanitizeStudentProfile(profile);
};

const upsertStudentProfile = async (user, payload) => {
  ensureRoleAndInstitute(user, USER_ROLES.STUDENT);

  const normalizedPayload = normalizeStudentPayload(payload);
  let profile = await StudentProfile.findOne({ user: user._id });

  if (profile && profile.institute.toString() !== user.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage your own profile.', 403);
  }

  if (!profile) {
    try {
      profile = await StudentProfile.create({
        ...normalizedPayload,
        user: user._id,
        institute: user.institute
      });
    } catch (error) {
      if (error?.code === 11000) {
        throw buildError('A student profile already exists for this user.', 409);
      }

      throw error;
    }
  } else {
    Object.assign(profile, normalizedPayload);
    await profile.save();
  }

  const populatedProfile = await StudentProfile.findById(profile._id).populate(
    'user',
    'name email role institute status'
  );

  return sanitizeStudentProfile(populatedProfile);
};

const getAlumniProfile = async (user) => {
  ensureRoleAndInstitute(user, USER_ROLES.ALUMNI);

  const profile = await AlumniProfile.findOne({ user: user._id, institute: user.institute }).populate(
    'user',
    'name email role institute status'
  );

  if (!profile) {
    throw buildError('Alumni profile not found.', 404);
  }

  return sanitizeAlumniProfile(profile);
};

const upsertAlumniProfile = async (user, payload) => {
  ensureRoleAndInstitute(user, USER_ROLES.ALUMNI);

  const normalizedPayload = normalizeAlumniPayload(payload);
  let profile = await AlumniProfile.findOne({ user: user._id });

  if (profile && profile.institute.toString() !== user.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage your own profile.', 403);
  }

  if (!profile) {
    try {
      profile = await AlumniProfile.create({
        ...normalizedPayload,
        user: user._id,
        institute: user.institute
      });
    } catch (error) {
      if (error?.code === 11000) {
        throw buildError('An alumni profile already exists for this user.', 409);
      }

      throw error;
    }
  } else {
    Object.assign(profile, normalizedPayload);
    profile.verificationStatus = ALUMNI_VERIFICATION_STATUSES.PENDING;
    profile.verificationReason = '';
    profile.verifiedBy = null;
    profile.verifiedAt = null;
    await profile.save();
  }

  const populatedProfile = await AlumniProfile.findById(profile._id).populate(
    'user',
    'name email role institute status'
  );

  return sanitizeAlumniProfile(populatedProfile);
};

const listInstituteAlumniProfiles = async (adminUser, query = {}) => {
  ensureInstituteAdminContext(adminUser);

  const filter = { institute: adminUser.institute };

  if (query.status) {
    filter.verificationStatus = query.status;
  }

  const profiles = await AlumniProfile.find(filter)
    .populate('user', 'name email status')
    .populate('verifiedBy', 'name email')
    .sort({ updatedAt: -1 });

  return profiles.map(sanitizeAlumniProfile);
};

const getPendingInstituteAlumniProfiles = async (adminUser) =>
  listInstituteAlumniProfiles(adminUser, { status: ALUMNI_VERIFICATION_STATUSES.PENDING });

const getInstituteScopedAlumniProfile = async (adminUser, profileId) => {
  ensureInstituteAdminContext(adminUser);
  ensureValidProfileId(profileId);

  const profile = await AlumniProfile.findById(profileId);

  if (!profile) {
    throw buildError('Alumni profile not found.', 404);
  }

  if (!profile.institute || profile.institute.toString() !== adminUser.institute.toString()) {
    throw buildError('Institute mismatch. You can only manage alumni from your own institute.', 403);
  }

  return profile;
};

const verifyAlumniProfile = async (adminUser, profileId) => {
  const profile = await getInstituteScopedAlumniProfile(adminUser, profileId);

  profile.verificationStatus = ALUMNI_VERIFICATION_STATUSES.VERIFIED;
  profile.verificationReason = '';
  profile.verifiedBy = adminUser._id;
  profile.verifiedAt = new Date();
  await profile.save();

  await createNotification({
    recipient: profile.user,
    institute: profile.institute,
    type: NOTIFICATION_TYPES.ALUMNI_VERIFIED,
    title: 'Alumni profile verified',
    message: 'Your alumni profile has been verified by your institute admin.',
    relatedModel: 'AlumniProfile',
    relatedId: profile._id
  });

  const populatedProfile = await AlumniProfile.findById(profile._id)
    .populate('user', 'name email status')
    .populate('verifiedBy', 'name email');

  return sanitizeAlumniProfile(populatedProfile);
};

const rejectAlumniProfile = async (adminUser, profileId, reason) => {
  if (!reason || !String(reason).trim()) {
    throw buildError('Rejection reason is required.', 400);
  }

  const profile = await getInstituteScopedAlumniProfile(adminUser, profileId);

  profile.verificationStatus = ALUMNI_VERIFICATION_STATUSES.REJECTED;
  profile.verificationReason = String(reason).trim();
  profile.verifiedBy = adminUser._id;
  profile.verifiedAt = new Date();
  await profile.save();

  await createNotification({
    recipient: profile.user,
    institute: profile.institute,
    type: NOTIFICATION_TYPES.ALUMNI_REJECTED,
    title: 'Alumni profile rejected',
    message: `Your alumni profile was rejected. Reason: ${profile.verificationReason}`,
    relatedModel: 'AlumniProfile',
    relatedId: profile._id
  });

  const populatedProfile = await AlumniProfile.findById(profile._id)
    .populate('user', 'name email status')
    .populate('verifiedBy', 'name email');

  return sanitizeAlumniProfile(populatedProfile);
};

const buildStudentAlumniSearchFilter = (studentUser, query = {}) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);

  const filter = {
    institute: studentUser.institute,
    verificationStatus: ALUMNI_VERIFICATION_STATUSES.VERIFIED,
    profileCompleted: true
  };

  if (query.branch) {
    filter.branch = buildContainsRegex(query.branch);
  }

  if (query.batch) {
    filter.batch = buildContainsRegex(query.batch);
  }

  if (query.currentCompany || query.company) {
    filter.currentCompany = buildContainsRegex(query.currentCompany || query.company);
  }

  if (query.skill) {
    filter.skills = buildContainsRegex(query.skill);
  }

  if (query.domain) {
    filter.domain = buildContainsRegex(query.domain);
  }

  if (query.location) {
    filter.location = buildContainsRegex(query.location);
  }

  return filter;
};

const populateStudentVisibleAlumniUser = {
  path: 'user',
  select: 'name email role status institute',
  match: {
    role: USER_ROLES.ALUMNI,
    status: USER_STATUSES.ACTIVE
  }
};

const searchStudentVisibleAlumni = async (studentUser, query = {}) => {
  const filter = buildStudentAlumniSearchFilter(studentUser, query);
  const profiles = await AlumniProfile.find(filter)
    .populate(populateStudentVisibleAlumniUser)
    .sort({ verifiedAt: -1, updatedAt: -1 });

  return profiles
    .filter((profile) => profile.user && profile.user.institute?.toString() === studentUser.institute.toString())
    .map(sanitizeStudentVisibleAlumniSummary);
};

const getStudentVisibleAlumniDetail = async (studentUser, profileId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  ensureValidProfileId(profileId);

  const profile = await AlumniProfile.findById(profileId).populate(populateStudentVisibleAlumniUser);

  if (!profile) {
    throw buildError('Alumni profile not found.', 404);
  }

  const isVisibleToStudent =
    profile.user &&
    profile.institute?.toString() === studentUser.institute.toString() &&
    profile.user.institute?.toString() === studentUser.institute.toString() &&
    profile.verificationStatus === ALUMNI_VERIFICATION_STATUSES.VERIFIED &&
    profile.profileCompleted;

  if (!isVisibleToStudent) {
    throw buildError('Verified alumni profile not found in your institute.', 404);
  }

  const connectionRequest = await getStudentToAlumniConnectionRequest(studentUser, profile.user._id);

  return {
    ...sanitizeStudentVisibleAlumniDetail(profile),
    connectionRequest
  };
};

export {
  getAlumniProfile,
  getPendingInstituteAlumniProfiles,
  getStudentProfile,
  getStudentVisibleAlumniDetail,
  listInstituteAlumniProfiles,
  rejectAlumniProfile,
  searchStudentVisibleAlumni,
  upsertAlumniProfile,
  upsertStudentProfile,
  verifyAlumniProfile
};
