import express from 'express';
import { getAttendance, updateAttendance, getAttendanceStats } from '../controllers/attendance.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getAttendance);
router.post('/update', protect, updateAttendance);
router.get('/stats', protect, getAttendanceStats);

export default router;
