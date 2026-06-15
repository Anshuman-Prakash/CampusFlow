import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getMorningBriefing,
  getTodaySchedule,
  regenerateSchedule,
} from '../controllers/dailyPlanner.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get morning briefing
router.get('/briefing', getMorningBriefing);

// Get today's AI-generated schedule
router.get('/today', getTodaySchedule);

// Regenerate schedule
router.post('/generate', regenerateSchedule);

export default router;
