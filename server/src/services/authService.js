import crypto from 'crypto';
import emailService from './email/emailService.js';
import User, { USER_ROLES, USER_STATUSES } from '../models/User.js';
import { getFrontendUrl } from '../utils/urlBuilder.js';

const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateRegisterInput = ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required.');
    error.statusCode = 400;
    throw error;
  }

  if (password.trim().length < 6) {
    const error = new Error('Password must be at least 6 characters.');
    error.statusCode = 400;
    throw error;
  }

  if (role && !Object.values(USER_ROLES).includes(role)) {
    const error = new Error('Invalid role provided.');
    error.statusCode = 400;
    throw error;
  }
};

const registerUser = async ({ name, email, password, role, institute, status }) => {
  validateRegisterInput({ name, email, password, role });

  if (status && !Object.values(USER_STATUSES).includes(status)) {
    const error = new Error('Invalid status provided.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error('User already exists with this email.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: password.trim(),
    role: role || USER_ROLES.STUDENT,
    institute: institute || null,
    status: status || USER_STATUSES.ACTIVE
  });

  return sanitizeUser(user);
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.status === USER_STATUSES.PENDING && user.role === USER_ROLES.INSTITUTE_ADMIN) {
    const error = new Error('Your institute registration is awaiting approval.');
    error.statusCode = 403;
    throw error;
  }

  if (user.status === USER_STATUSES.REJECTED) {
    const error = new Error('Your institute application was rejected. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  if (user.status === USER_STATUSES.SUSPENDED) {
    const error = new Error('Your account has been suspended.');
    error.statusCode = 403;
    throw error;
  }

  // Preserve existing login behavior for other roles/statuses if not actively restricted
  if (user.status !== USER_STATUSES.ACTIVE && user.status !== USER_STATUSES.PENDING) {
    const error = new Error('Your account is not active.');
    error.statusCode = 403;
    throw error;
  }

  return sanitizeUser(user);
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

const forgotPassword = async (email) => {
  if (!email) {
    const error = new Error('Email is required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  // If user doesn't exist, we return true silently to prevent email enumeration.
  if (!user) {
    return true;
  }

  // Generate a random raw token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and set expiration (1 hour)
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Generate the frontend reset link containing the RAW token
  const resetUrl = getFrontendUrl(`reset-password/${resetToken}`);

  try {
    await emailService.sendForgotPasswordEmail(user.email, resetUrl);
    return true;
  } catch (err) {
    // If email sending fails, clear the tokens so they can't be exploited
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    const error = new Error('There was an error sending the password reset email. Please try again later.');
    error.statusCode = 500;
    throw error;
  }
};

const resetPassword = async (resetToken, newPassword) => {
  if (!resetToken || !newPassword) {
    const error = new Error('Token and new password are required.');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.trim().length < 8) {
    const error = new Error('Password must be at least 8 characters.');
    error.statusCode = 400;
    throw error;
  }

  // Hash the incoming raw token to find it in the DB
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Find user by hashed token AND ensure it has not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Password reset token is invalid or has expired.');
    error.statusCode = 400;
    throw error;
  }

  // Set the new password and clear the reset fields
  user.password = newPassword.trim();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Send a confirmation email that the password was changed
  try {
    await emailService.sendPasswordChangedEmail(user.email);
  } catch (err) {
    // We don't fail the reset process if the confirmation email fails, 
    // but we can log it (silently ignored for user).
    console.error('Failed to send password changed confirmation email', err);
  }

  return true;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    const error = new Error('Current password and new password are required.');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.trim().length < 6) {
    const error = new Error('New password must be at least 6 characters.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.matchPassword(currentPassword))) {
    const error = new Error('Invalid current password.');
    error.statusCode = 401;
    throw error;
  }

  user.password = newPassword.trim();
  user.mustChangePassword = false;
  await user.save();

  return sanitizeUser(user);
};

export { changePassword, forgotPassword, getUserById, loginUser, registerUser, resetPassword };
