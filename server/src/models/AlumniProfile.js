import mongoose from 'mongoose';

export const ALUMNI_VERIFICATION_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
});

const alumniProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institute',
      required: true
    },
    branch: {
      type: String,
      required: [true, 'Branch is required.'],
      trim: true
    },
    batch: {
      type: String,
      required: [true, 'Batch is required.'],
      trim: true
    },
    currentCompany: {
      type: String,
      required: [true, 'Current company is required.'],
      trim: true
    },
    currentRole: {
      type: String,
      required: [true, 'Current role is required.'],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required.'],
      min: [0, 'Experience years cannot be negative.']
    },
    skills: {
      type: [String],
      default: []
    },
    domain: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    linkedInUrl: {
      type: String,
      default: '',
      trim: true
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true
    },
    portfolioUrl: {
      type: String,
      default: '',
      trim: true
    },
    bio: {
      type: String,
      default: '',
      trim: true
    },
    canProvideReferral: {
      type: Boolean,
      default: false
    },
    canMentor: {
      type: Boolean,
      default: false
    },
    verificationStatus: {
      type: String,
      enum: Object.values(ALUMNI_VERIFICATION_STATUSES),
      default: ALUMNI_VERIFICATION_STATUSES.PENDING
    },
    verificationReason: {
      type: String,
      default: '',
      trim: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const AlumniProfile = mongoose.model('AlumniProfile', alumniProfileSchema);

export default AlumniProfile;
