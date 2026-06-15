import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  uploadTimetable,
  saveManualTimetable,
  getTimetable,
  getTodayClasses,
  updateTimetableEntry,
  deleteTimetableEntry,
} from '../controllers/timetable.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload timetable (PDF/Image) for AI extraction
router.post('/upload', uploadTimetable);

// Save manual timetable
router.post('/manual', saveManualTimetable);

// Get user's timetable
router.get('/', getTimetable);

// Get today's classes
router.get('/today', getTodayClasses);

// Update timetable entry
router.put('/:classId', updateTimetableEntry);

// Delete timetable entry
router.delete('/:classId', deleteTimetableEntry);

export default router;
