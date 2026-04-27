import mongoose from 'mongoose';
import AlumniProfile, { ALUMNI_VERIFICATION_STATUSES } from '../models/AlumniProfile.js';
import GuidanceRequest, {
  GUIDANCE_REQUEST_STATUSES,
  GUIDANCE_REQUEST_TYPES
} from '../models/GuidanceRequest.js';
import { NOTIFICATION_TYPES } from '../models/Notification.js';
import StudentProfile from '../models/StudentProfile.js';
import { createNotification } from './notificationService.js';
import { USER_ROLES, USER_STATUSES } from '../models/User.js';

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

const ensureValidObjectId = (value, label) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw buildError(`Invalid ${label}.`, 400);
  }
};

const validateCreatePayload = (payload = {}) => {
  if (!payload.alumniId) {
    throw buildError('alumniId is required.', 400);
  }

  if (!payload.type || !Object.values(GUIDANCE_REQUEST_TYPES).includes(payload.type)) {
    throw buildError('Invalid request type.', 400);
  }

  if (!payload.title || !String(payload.title).trim()) {
    throw buildError('Title is required.', 400);
  }

  if (!payload.message || !String(payload.message).trim()) {
    throw buildError('Message is required.', 400);
  }
};

const sanitizeStudentGuidanceRequest = (request) => ({
  _id: request._id,
  type: request.type,
  title: request.title,
  message: request.message,
  status: request.status,
  responseMessage: request.responseMessage,
  respondedAt: request.respondedAt,
  completedAt: request.completedAt,
  createdAt: request.createdAt,
  updatedAt: request.updatedAt,
  alumni: request.alumni
    ? {
        _id: request.alumni._id,
        name: request.alumni.name,
        email: request.alumni.email
      }
    : null,
  alumniProfile: request.alumniProfile
    ? {
        _id: request.alumniProfile._id,
        currentCompany: request.alumniProfile.currentCompany,
        currentRole: request.alumniProfile.currentRole,
        domain: request.alumniProfile.domain,
        canProvideReferral: request.alumniProfile.canProvideReferral,
        canMentor: request.alumniProfile.canMentor
      }
    : null
});

const sanitizeAlumniGuidanceRequest = (request) => ({
  _id: request._id,
  type: request.type,
  title: request.title,
  message: request.message,
  status: request.status,
  responseMessage: request.responseMessage,
  respondedAt: request.respondedAt,
  completedAt: request.completedAt,
  createdAt: request.createdAt,
  updatedAt: request.updatedAt,
  student: request.student
    ? {
        _id: request.student._id,
        name: request.student.name,
        email: request.student.email
      }
    : null,
  studentProfile: request.studentProfile
    ? {
        _id: request.studentProfile._id,
        branch: request.studentProfile.branch,
        batch: request.studentProfile.batch,
        skills: request.studentProfile.skills,
        careerGoals: request.studentProfile.careerGoals
      }
    : null
});

const getVerifiedVisibleAlumniProfileForStudent = async (studentUser, alumniProfileId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  ensureValidObjectId(alumniProfileId, 'alumni ID');

  const alumniProfile = await AlumniProfile.findById(alumniProfileId).populate({
    path: 'user',
    select: 'name email role status institute',
    match: {
      role: USER_ROLES.ALUMNI,
      status: USER_STATUSES.ACTIVE
    }
  });

  if (!alumniProfile) {
    throw buildError('Alumni not found.', 404);
  }

  const isVisible =
    alumniProfile.user &&
    alumniProfile.institute?.toString() === studentUser.institute.toString() &&
    alumniProfile.user.institute?.toString() === studentUser.institute.toString() &&
    alumniProfile.verificationStatus === ALUMNI_VERIFICATION_STATUSES.VERIFIED &&
    alumniProfile.profileCompleted;

  if (!isVisible) {
    throw buildError('Verified alumni not found in your institute.', 404);
  }

  if (alumniProfile.user._id.toString() === studentUser._id.toString()) {
    throw buildError('Student cannot send a guidance request to themselves.', 400);
  }

  return alumniProfile;
};

const getStudentGuidanceRequests = async (studentUser) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);

  const requests = await GuidanceRequest.find({
    student: studentUser._id,
    institute: studentUser.institute
  })
    .populate('alumni', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const alumniUserIds = requests.map((request) => request.alumni?._id).filter(Boolean);
  const alumniProfiles = await AlumniProfile.find({ user: { $in: alumniUserIds } })
    .select('user currentCompany currentRole domain canProvideReferral canMentor')
    .lean();

  const alumniProfileMap = new Map(alumniProfiles.map((profile) => [profile.user.toString(), profile]));

  return requests.map((request) =>
    sanitizeStudentGuidanceRequest({
      ...request,
      alumniProfile: request.alumni ? alumniProfileMap.get(request.alumni._id.toString()) : null
    })
  );
};

const getStudentGuidanceRequestById = async (studentUser, requestId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  ensureValidObjectId(requestId, 'request ID');

  const request = await GuidanceRequest.findOne({
    _id: requestId,
    student: studentUser._id,
    institute: studentUser.institute
  })
    .populate('alumni', 'name email')
    .lean();

  if (!request) {
    throw buildError('Guidance request not found.', 404);
  }

  const alumniProfile = request.alumni
    ? await AlumniProfile.findOne({ user: request.alumni._id })
        .select('user currentCompany currentRole domain canProvideReferral canMentor')
        .lean()
    : null;

  return sanitizeStudentGuidanceRequest({ ...request, alumniProfile });
};

const createGuidanceRequest = async (studentUser, payload = {}) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  validateCreatePayload(payload);

  const alumniProfile = await getVerifiedVisibleAlumniProfileForStudent(studentUser, payload.alumniId);

  const request = await GuidanceRequest.create({
    student: studentUser._id,
    alumni: alumniProfile.user._id,
    institute: studentUser.institute,
    type: payload.type,
    title: String(payload.title).trim(),
    message: String(payload.message).trim()
  });

  await createNotification({
    recipient: alumniProfile.user._id,
    institute: studentUser.institute,
    type: NOTIFICATION_TYPES.GUIDANCE_REQUEST,
    title: 'New guidance request',
    message: `${studentUser.name} sent you a ${payload.type.toLowerCase().replaceAll('_', ' ')} request.`,
    relatedModel: 'GuidanceRequest',
    relatedId: request._id
  });

  return getStudentGuidanceRequestById(studentUser, request._id);
};

const cancelStudentGuidanceRequest = async (studentUser, requestId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  ensureValidObjectId(requestId, 'request ID');

  const request = await GuidanceRequest.findOne({
    _id: requestId,
    student: studentUser._id,
    institute: studentUser.institute
  });

  if (!request) {
    throw buildError('Guidance request not found.', 404);
  }

  if (request.status !== GUIDANCE_REQUEST_STATUSES.PENDING) {
    throw buildError('Only pending guidance requests can be cancelled.', 400);
  }

  request.status = GUIDANCE_REQUEST_STATUSES.CANCELLED;
  await request.save();

  return getStudentGuidanceRequestById(studentUser, request._id);
};

const getAlumniGuidanceRequests = async (alumniUser) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);

  const requests = await GuidanceRequest.find({
    alumni: alumniUser._id,
    institute: alumniUser.institute
  })
    .populate('student', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const studentUserIds = requests.map((request) => request.student?._id).filter(Boolean);
  const studentProfiles = await StudentProfile.find({ user: { $in: studentUserIds } })
    .select('user branch batch skills careerGoals')
    .lean();

  const studentProfileMap = new Map(studentProfiles.map((profile) => [profile.user.toString(), profile]));

  return requests.map((request) =>
    sanitizeAlumniGuidanceRequest({
      ...request,
      studentProfile: request.student ? studentProfileMap.get(request.student._id.toString()) : null
    })
  );
};

const getAlumniGuidanceRequestById = async (alumniUser, requestId) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);
  ensureValidObjectId(requestId, 'request ID');

  const request = await GuidanceRequest.findOne({
    _id: requestId,
    alumni: alumniUser._id,
    institute: alumniUser.institute
  })
    .populate('student', 'name email')
    .lean();

  if (!request) {
    throw buildError('Guidance request not found.', 404);
  }

  const studentProfile = request.student
    ? await StudentProfile.findOne({ user: request.student._id })
        .select('user branch batch skills careerGoals')
        .lean()
    : null;

  return sanitizeAlumniGuidanceRequest({ ...request, studentProfile });
};

const getAlumniOwnedGuidanceRequest = async (alumniUser, requestId) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);
  ensureValidObjectId(requestId, 'request ID');

  const request = await GuidanceRequest.findOne({
    _id: requestId,
    alumni: alumniUser._id,
    institute: alumniUser.institute
  });

  if (!request) {
    throw buildError('Guidance request not found.', 404);
  }

  return request;
};

const updateGuidanceRequestAsAlumni = async (alumniUser, requestId, action, responseMessage = '') => {
  const request = await getAlumniOwnedGuidanceRequest(alumniUser, requestId);
  const trimmedResponseMessage = String(responseMessage || '').trim();

  if (action === 'accept') {
    if (request.status !== GUIDANCE_REQUEST_STATUSES.PENDING) {
      throw buildError('Only pending guidance requests can be accepted.', 400);
    }

    request.status = GUIDANCE_REQUEST_STATUSES.ACCEPTED;
    request.responseMessage = trimmedResponseMessage;
    request.respondedAt = new Date();
  }

  if (action === 'reject') {
    if (request.status !== GUIDANCE_REQUEST_STATUSES.PENDING) {
      throw buildError('Only pending guidance requests can be rejected.', 400);
    }

    request.status = GUIDANCE_REQUEST_STATUSES.REJECTED;
    request.responseMessage = trimmedResponseMessage;
    request.respondedAt = new Date();
  }

  if (action === 'complete') {
    if (request.status !== GUIDANCE_REQUEST_STATUSES.ACCEPTED) {
      throw buildError('Only accepted guidance requests can be completed.', 400);
    }

    request.status = GUIDANCE_REQUEST_STATUSES.COMPLETED;
    request.responseMessage = trimmedResponseMessage || request.responseMessage;
    request.completedAt = new Date();
  }

  await request.save();

  const notificationConfig =
    action === 'accept'
      ? {
          type: NOTIFICATION_TYPES.GUIDANCE_ACCEPTED,
          title: 'Guidance request accepted',
          message: `${alumniUser.name} accepted your guidance request.`
        }
      : action === 'reject'
        ? {
            type: NOTIFICATION_TYPES.GUIDANCE_REJECTED,
            title: 'Guidance request rejected',
            message: `${alumniUser.name} rejected your guidance request.`
          }
        : {
            type: NOTIFICATION_TYPES.GUIDANCE_COMPLETED,
            title: 'Guidance request completed',
            message: `${alumniUser.name} marked your guidance request as completed.`
          };

  await createNotification({
    recipient: request.student,
    institute: request.institute,
    type: notificationConfig.type,
    title: notificationConfig.title,
    message: notificationConfig.message,
    relatedModel: 'GuidanceRequest',
    relatedId: request._id
  });

  return getAlumniGuidanceRequestById(alumniUser, request._id);
};

export {
  GUIDANCE_REQUEST_STATUSES,
  GUIDANCE_REQUEST_TYPES,
  cancelStudentGuidanceRequest,
  createGuidanceRequest,
  getAlumniGuidanceRequestById,
  getAlumniGuidanceRequests,
  getStudentGuidanceRequestById,
  getStudentGuidanceRequests,
  updateGuidanceRequestAsAlumni
};
