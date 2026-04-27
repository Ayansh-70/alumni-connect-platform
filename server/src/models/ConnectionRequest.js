import mongoose from 'mongoose';

export const CONNECTION_REQUEST_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
});

const connectionRequestSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: Object.values(CONNECTION_REQUEST_STATUSES),
      default: CONNECTION_REQUEST_STATUSES.PENDING
    },
    message: {
      type: String,
      default: '',
      trim: true
    },
    respondedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

connectionRequestSchema.index({ student: 1, alumni: 1 }, { unique: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;
