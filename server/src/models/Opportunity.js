import mongoose from 'mongoose';

export const OPPORTUNITY_TYPES = Object.freeze({
  INTERNSHIP: 'INTERNSHIP',
  JOB: 'JOB',
  REFERRAL: 'REFERRAL',
  HACKATHON: 'HACKATHON',
  SCHOLARSHIP: 'SCHOLARSHIP',
  PROJECT: 'PROJECT',
  HIGHER_STUDIES: 'HIGHER_STUDIES',
  OTHER: 'OTHER'
});

export const OPPORTUNITY_MODES = Object.freeze({
  REMOTE: 'REMOTE',
  ONSITE: 'ONSITE',
  HYBRID: 'HYBRID'
});

export const OPPORTUNITY_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED'
});

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(OPPORTUNITY_TYPES),
      required: true
    },
    company: {
      type: String,
      required: [true, 'Company is required.'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required.'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true
    },
    mode: {
      type: String,
      enum: Object.values(OPPORTUNITY_MODES),
      required: true
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility is required.'],
      trim: true
    },
    skillsRequired: {
      type: [String],
      default: []
    },
    applicationLink: {
      type: String,
      required: [true, 'Application link is required.'],
      trim: true
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required.']
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institute',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(OPPORTUNITY_STATUSES),
      default: OPPORTUNITY_STATUSES.PENDING
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
