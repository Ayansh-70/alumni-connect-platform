import rateLimit from 'express-rate-limit';

const createRateLimiter = (maxEnv, windowMsEnv, defaultMax, defaultWindowMs, message) => {
  return rateLimit({
    windowMs: process.env[windowMsEnv] ? parseInt(process.env[windowMsEnv], 10) : defaultWindowMs,
    max: process.env[maxEnv] ? parseInt(process.env[maxEnv], 10) : defaultMax,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const loginLimiter = createRateLimiter(
  'LOGIN_RATE_LIMIT_MAX', 
  'LOGIN_RATE_LIMIT_WINDOW_MS', 
  50, 
  15 * 60 * 1000, 
  'Too many login attempts, please try again later.'
);

export const forgotPasswordLimiter = createRateLimiter(
  'FORGOT_PASSWORD_RATE_LIMIT_MAX', 
  'FORGOT_PASSWORD_RATE_LIMIT_WINDOW_MS', 
  20, 
  60 * 60 * 1000,
  'Too many password reset requests, please try again later.'
);

export const registerLimiter = createRateLimiter(
  'REGISTER_RATE_LIMIT_MAX', 
  'REGISTER_RATE_LIMIT_WINDOW_MS', 
  30, 
  60 * 60 * 1000,
  'Too many registration requests, please try again later.'
);
