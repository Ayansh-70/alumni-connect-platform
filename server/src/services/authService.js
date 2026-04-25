import User, { USER_ROLES, USER_STATUSES } from '../models/User.js';

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

  if (user.status !== USER_STATUSES.ACTIVE) {
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

export { getUserById, loginUser, registerUser };
