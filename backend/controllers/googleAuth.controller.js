import { generateToken } from '../utils/jwt.js';
import StudentProfile from '../models/StudentProfile.model.js';

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleAuthCallback = async (req, res) => {
  try {
    // User is authenticated via Passport
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Check if student profile exists, create if not
    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await StudentProfile.create({
        user: user._id,
        fullName: user.name,
        email: user.email,
        profilePicture: user.avatar,
        onboardingCompleted: false,
        onboardingStep: 0,
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      branch: user.branch,
      role: user.role,
      avatar: user.avatar,
    })}`);
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

// @desc    Initiate Google OAuth
// @route   GET /api/auth/google
// @access  Public
// This is handled by Passport middleware
