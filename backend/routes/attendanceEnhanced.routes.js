import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  markAttendance,
  getIntelligence,
  getAlerts,
  bulkSetupAttendance,
} from '../controllers/attendanceEnhanced.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Mark today's attendance
router.post('/mark', markAttendance);

// Get AI intelligence insights
router.get('/intelligence', getIntelligence);

// Get attendance alerts
router.get('/alerts', getAlerts);

// Bulk setup (for onboarding)
router.post('/bulk', bulkSetupAttendance);

export default router;
