import mongoose from 'mongoose';

export const ANNOUNCEMENT_CATEGORIES = Object.freeze({
  GENERAL: 'GENERAL',
  ACADEMIC: 'ACADEMIC',
  PLACEMENT: 'PLACEMENT',
  ALUMNI: 'ALUMNI',
  EVENT: 'EVENT',
  URGENT: 'URGENT',
  OTHER: 'OTHER'
});

export const ANNOUNCEMENT_AUDIENCES = Object.freeze({
  STUDENTS: 'STUDENTS',
  ALUMNI: 'ALUMNI',
  BOTH: 'BOTH'
});

const announcementSchema = new mongoose.Schema(
  {
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
    category: {
      type: String,
      enum: Object.values(ANNOUNCEMENT_CATEGORIES),
      required: true
    },
    audience: {
      type: String,
      enum: Object.values(ANNOUNCEMENT_AUDIENCES),
      required: true
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institute',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
