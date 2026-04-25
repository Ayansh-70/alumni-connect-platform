import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const USER_ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  INSTITUTE_ADMIN: 'INSTITUTE_ADMIN',
  STUDENT: 'STUDENT',
  ALUMNI: 'ALUMNI'
});

export const USER_STATUSES = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING'
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institute',
      default: null
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
