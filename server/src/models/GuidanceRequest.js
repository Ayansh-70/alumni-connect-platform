import mongoose from 'mongoose';

export const GUIDANCE_REQUEST_TYPES = Object.freeze({
  MENTORSHIP: 'MENTORSHIP',
  REFERRAL: 'REFERRAL',
  INTERNSHIP_HELP: 'INTERNSHIP_HELP',
  JOB_GUIDANCE: 'JOB_GUIDANCE',
  PROJECT_GUIDANCE: 'PROJECT_GUIDANCE',
  HIGHER_STUDIES: 'HIGHER_STUDIES',
  GENERAL_CAREER_ADVICE: 'GENERAL_CAREER_ADVICE'
});

export const GUIDANCE_REQUEST_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
});

const guidanceRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institute',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(GUIDANCE_REQUEST_TYPES),
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required.'],
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(GUIDANCE_REQUEST_STATUSES),
      default: GUIDANCE_REQUEST_STATUSES.PENDING
    },
    responseMessage: {
      type: String,
      default: '',
      trim: true
    },
    respondedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const GuidanceRequest = mongoose.model('GuidanceRequest', guidanceRequestSchema);

export default GuidanceRequest;
