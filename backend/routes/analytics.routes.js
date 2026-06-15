import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Attendance from '../models/Attendance.model.js';
import Assignment from '../models/Assignment.model.js';

const router = express.Router();

// Get productivity stats
router.get('/productivity', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id });
    const attendance = await Attendance.find({ user: req.user.id });

    const completed = assignments.filter(a => a.status === 'completed').length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    const avgAttendance = attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length;

    res.status(200).json({
      success: true,
      data: {
        assignmentsCompleted: completed,
        assignmentsPending: pending,
        averageAttendance: avgAttendance.toFixed(2),
        studyStreak: 12,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch productivity stats' });
  }
});

// Get weekly report
router.get('/weekly-report', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        weeklyStudyHours: [4, 6, 5, 7, 5, 3, 2],
        attendanceTrend: [85, 86, 84, 87, 88, 86, 87],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch weekly report' });
  }
});

export default router;
