import express from 'express';
import passport from 'passport';
import { signup, login, verifyToken } from '../controllers/auth.controller.js';
import { googleAuthCallback } from '../controllers/googleAuth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Regular Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', protect, verifyToken);

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    session: false,
  }),
  googleAuthCallback
);

export default router;
