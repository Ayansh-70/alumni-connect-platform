import mongoose from 'mongoose';

export const EVENT_TYPES = Object.freeze({
  WEBINAR: 'WEBINAR',
  WORKSHOP: 'WORKSHOP',
  MEETUP: 'MEETUP',
  PLACEMENT_DRIVE: 'PLACEMENT_DRIVE',
  ALUMNI_TALK: 'ALUMNI_TALK',
  NETWORKING: 'NETWORKING',
  OTHER: 'OTHER'
});

export const EVENT_MODES = Object.freeze({
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  HYBRID: 'HYBRID'
});

export const EVENT_AUDIENCES = Object.freeze({
  STUDENTS: 'STUDENTS',
  ALUMNI: 'ALUMNI',
  BOTH: 'BOTH'
});

const eventSchema = new mongoose.Schema(
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
    eventType: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required.']
    },
    startTime: {
      type: String,
      required: [true, 'startTime is required.'],
      trim: true
    },
    endTime: {
      type: String,
      required: [true, 'endTime is required.'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true
    },
    mode: {
      type: String,
      enum: Object.values(EVENT_MODES),
      required: true
    },
    meetingLink: {
      type: String,
      default: '',
      trim: true
    },
    audience: {
      type: String,
      enum: Object.values(EVENT_AUDIENCES),
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

const Event = mongoose.model('Event', eventSchema);

export default Event;
