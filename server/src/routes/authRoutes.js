import { Router } from 'express';
import { forgotPassword, getMe, login, register, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { forgotPasswordLimiter, loginLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
