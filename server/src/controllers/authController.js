import asyncHandler from 'express-async-handler';
import { getUserById, loginUser, registerUser } from '../services/authService.js';
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

export { getMe, login, register };
