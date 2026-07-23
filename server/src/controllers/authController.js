import asyncHandler from 'express-async-handler';
import { changePassword as changePasswordService, forgotPassword as forgotPasswordService, getUserById, loginUser, registerUser, resetPassword as resetPasswordService } from '../services/authService.js';
import generateToken from '../utils/generateToken.js';

const buildAuthResponse = (message, user) => ({
  success: true,
  message,
  data: {
    user,
    token: generateToken(user._id.toString())
  }
});

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json(buildAuthResponse('User registered successfully.', user));
});

const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);

  res.status(200).json(buildAuthResponse('Login successful.', user));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully.',
    data: { user }
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await changePasswordService(req.user._id, currentPassword, newPassword);

  res.status(200).json(buildAuthResponse('Password changed successfully.', user));
});

const forgotPassword = asyncHandler(async (req, res) => {
  await forgotPasswordService(req.body.email);

  res.status(200).json({
    success: true,
    message: 'If an account exists with that email, password reset instructions have been sent.'
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  await resetPasswordService(req.params.token, req.body.password);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully.'
  });
});

export { changePassword, forgotPassword, getMe, login, register, resetPassword };
