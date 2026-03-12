import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// @route  POST /auth/register
// @desc   Register a new user
// @access Public
router.post('/register', register);

// @route  POST /auth/login
// @desc   Login and receive a JWT token
// @access Public
router.post('/login', login);

// @route  GET /auth/me
// @desc   Get current authenticated user
// @access Private
router.get('/me', authMiddleware, me);

export default router;
