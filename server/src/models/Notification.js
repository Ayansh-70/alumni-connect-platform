import mongoose from 'mongoose';

export const NOTIFICATION_TYPES = Object.freeze({
  CONNECTION_REQUEST: 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED: 'CONNECTION_ACCEPTED',
  CONNECTION_REJECTED: 'CONNECTION_REJECTED',
  GUIDANCE_REQUEST: 'GUIDANCE_REQUEST',
  GUIDANCE_ACCEPTED: 'GUIDANCE_ACCEPTED',
  GUIDANCE_REJECTED: 'GUIDANCE_REJECTED',
  GUIDANCE_COMPLETED: 'GUIDANCE_COMPLETED',
  OPPORTUNITY_APPROVED: 'OPPORTUNITY_APPROVED',
  OPPORTUNITY_REJECTED: 'OPPORTUNITY_REJECTED',
  NEW_ANNOUNCEMENT: 'NEW_ANNOUNCEMENT',
  NEW_EVENT: 'NEW_EVENT',
  ALUMNI_VERIFIED: 'ALUMNI_VERIFIED',
  ALUMNI_REJECTED: 'ALUMNI_REJECTED',
  GENERAL: 'GENERAL'
});

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
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
      enum: Object.values(NOTIFICATION_TYPES),
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
    relatedModel: {
      type: String,
      default: '',
      trim: true
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
