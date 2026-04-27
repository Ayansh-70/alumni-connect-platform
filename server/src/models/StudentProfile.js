import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
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
    semester: {
      type: String,
      required: [true, 'Semester is required.'],
      trim: true
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required.'],
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    careerGoals: {
      type: String,
      default: '',
      trim: true
    },
    bio: {
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
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

studentProfileSchema.index({ institute: 1, rollNumber: 1 }, { unique: true, sparse: true });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;
