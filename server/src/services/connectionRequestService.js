import mongoose from 'mongoose';
import AlumniProfile, { ALUMNI_VERIFICATION_STATUSES } from '../models/AlumniProfile.js';
import ConnectionRequest, { CONNECTION_REQUEST_STATUSES } from '../models/ConnectionRequest.js';
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

const sanitizeStudentConnection = (request) => ({
  _id: request._id,
  status: request.status,
  message: request.message,
  respondedAt: request.respondedAt,
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
        branch: request.alumniProfile.branch,
        batch: request.alumniProfile.batch,
        currentCompany: request.alumniProfile.currentCompany,
        currentRole: request.alumniProfile.currentRole,
        domain: request.alumniProfile.domain
      }
    : null
});

const sanitizeAlumniConnection = (request) => ({
  _id: request._id,
  status: request.status,
  message: request.message,
  respondedAt: request.respondedAt,
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
        semester: request.studentProfile.semester,
        skills: request.studentProfile.skills
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
    throw buildError('Student cannot send a connection request to themselves.', 400);
  }

  return alumniProfile;
};

const getExistingConnectionRequest = async (studentId, alumniId) =>
  ConnectionRequest.findOne({ student: studentId, alumni: alumniId });

const createConnectionRequest = async (studentUser, alumniProfileId, payload = {}) => {
  const alumniProfile = await getVerifiedVisibleAlumniProfileForStudent(studentUser, alumniProfileId);

  const existingRequest = await getExistingConnectionRequest(studentUser._id, alumniProfile.user._id);

  if (existingRequest) {
    throw buildError('Connection request already exists.', 409);
  }

  const message = String(payload.message || '').trim();

  try {
    const request = await ConnectionRequest.create({
      student: studentUser._id,
      alumni: alumniProfile.user._id,
      institute: studentUser.institute,
      message
    });

    await createNotification({
      recipient: alumniProfile.user._id,
      institute: studentUser.institute,
      type: NOTIFICATION_TYPES.CONNECTION_REQUEST,
      title: 'New connection request',
      message: `${studentUser.name} sent you a connection request.`,
      relatedModel: 'ConnectionRequest',
      relatedId: request._id
    });

    return getStudentConnectionRequestById(studentUser, request._id);
  } catch (error) {
    if (error?.code === 11000) {
      throw buildError('Connection request already exists.', 409);
    }

    throw error;
  }
};

const getStudentConnectionRequests = async (studentUser) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);

  const requests = await ConnectionRequest.find({
    student: studentUser._id,
    institute: studentUser.institute
  })
    .populate('alumni', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const alumniUserIds = requests.map((request) => request.alumni?._id).filter(Boolean);
  const alumniProfiles = await AlumniProfile.find({ user: { $in: alumniUserIds } })
    .select('user branch batch currentCompany currentRole domain')
    .lean();

  const alumniProfileMap = new Map(alumniProfiles.map((profile) => [profile.user.toString(), profile]));

  return requests.map((request) =>
    sanitizeStudentConnection({
      ...request,
      alumniProfile: request.alumni ? alumniProfileMap.get(request.alumni._id.toString()) : null
    })
  );
};

const getStudentConnectionRequestById = async (studentUser, requestId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);
  ensureValidObjectId(requestId, 'request ID');

  const request = await ConnectionRequest.findOne({
    _id: requestId,
    student: studentUser._id,
    institute: studentUser.institute
  })
    .populate('alumni', 'name email')
    .lean();

  if (!request) {
    throw buildError('Connection request not found.', 404);
  }

  const alumniProfile = request.alumni
    ? await AlumniProfile.findOne({ user: request.alumni._id })
        .select('user branch batch currentCompany currentRole domain')
        .lean()
    : null;

  return sanitizeStudentConnection({ ...request, alumniProfile });
};

const getAlumniReceivedConnectionRequests = async (alumniUser) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);

  const requests = await ConnectionRequest.find({
    alumni: alumniUser._id,
    institute: alumniUser.institute
  })
    .populate('student', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const studentUserIds = requests.map((request) => request.student?._id).filter(Boolean);
  const studentProfiles = await StudentProfile.find({ user: { $in: studentUserIds } })
    .select('user branch batch semester skills')
    .lean();

  const studentProfileMap = new Map(studentProfiles.map((profile) => [profile.user.toString(), profile]));

  return requests.map((request) =>
    sanitizeAlumniConnection({
      ...request,
      studentProfile: request.student ? studentProfileMap.get(request.student._id.toString()) : null
    })
  );
};

const getAlumniOwnedConnectionRequest = async (alumniUser, requestId) => {
  ensureRoleAndInstitute(alumniUser, USER_ROLES.ALUMNI);
  ensureValidObjectId(requestId, 'request ID');

  const request = await ConnectionRequest.findOne({
    _id: requestId,
    alumni: alumniUser._id,
    institute: alumniUser.institute
  });

  if (!request) {
    throw buildError('Connection request not found.', 404);
  }

  return request;
};

const updateConnectionRequestStatus = async (alumniUser, requestId, nextStatus) => {
  const request = await getAlumniOwnedConnectionRequest(alumniUser, requestId);

  if (request.status !== CONNECTION_REQUEST_STATUSES.PENDING) {
    throw buildError(`Connection request already ${request.status.toLowerCase()}.`, 400);
  }

  request.status = nextStatus;
  request.respondedAt = new Date();
  await request.save();

  await createNotification({
    recipient: request.student,
    institute: request.institute,
    type:
      nextStatus === CONNECTION_REQUEST_STATUSES.ACCEPTED
        ? NOTIFICATION_TYPES.CONNECTION_ACCEPTED
        : NOTIFICATION_TYPES.CONNECTION_REJECTED,
    title:
      nextStatus === CONNECTION_REQUEST_STATUSES.ACCEPTED
        ? 'Connection request accepted'
        : 'Connection request rejected',
    message:
      nextStatus === CONNECTION_REQUEST_STATUSES.ACCEPTED
        ? `${alumniUser.name} accepted your connection request.`
        : `${alumniUser.name} rejected your connection request.`,
    relatedModel: 'ConnectionRequest',
    relatedId: request._id
  });

  const requests = await getAlumniReceivedConnectionRequests(alumniUser);
  return requests.find((item) => item._id.toString() === request._id.toString());
};

const getStudentToAlumniConnectionRequest = async (studentUser, alumniUserId) => {
  ensureRoleAndInstitute(studentUser, USER_ROLES.STUDENT);

  if (!alumniUserId) {
    return null;
  }

  const request = await getExistingConnectionRequest(studentUser._id, alumniUserId);

  if (!request) {
    return null;
  }

  return {
    _id: request._id,
    status: request.status,
    message: request.message,
    respondedAt: request.respondedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  };
};

export {
  CONNECTION_REQUEST_STATUSES,
  createConnectionRequest,
  getAlumniReceivedConnectionRequests,
  getStudentConnectionRequestById,
  getStudentConnectionRequests,
  getStudentToAlumniConnectionRequest,
  updateConnectionRequestStatus
};
