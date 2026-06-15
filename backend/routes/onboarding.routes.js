import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getOnboardingStatus,
  saveBasicProfile,
  saveAttendanceSetup,
  saveGoals,
  saveTasks,
  completeOnboarding,
} from '../controllers/onboarding.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get onboarding status
router.get('/status', getOnboardingStatus);

// Step 1: Basic Profile
router.post('/step1', saveBasicProfile);

// Step 2: Timetable (handled in timetable routes)

// Step 3: Attendance Setup
router.post('/step3', saveAttendanceSetup);

// Step 4: Academic Goals
router.post('/step4', saveGoals);

// Step 5: Tasks Setup
router.post('/step5', saveTasks);

// Step 6: Complete Onboarding
router.post('/complete', completeOnboarding);

export default router;
