import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get daily plan
router.get('/daily', protect, async (req, res) => {
  try {
    const plan = {
      morning: 'Good Morning! You have 3 classes today.',
      schedule: [
        { time: '09:00 AM', activity: 'Data Structures Class', type: 'class' },
        { time: '11:00 AM', activity: 'DBMS Lab', type: 'lab' },
        { time: '02:00 PM', activity: 'Computer Networks', type: 'class' },
      ],
      alerts: ['Attendance warning in Computer Networks', '1 assignment due today'],
    };
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch daily plan' });
  }
});

// Generate AI plan
router.post('/generate', protect, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'AI plan generated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate plan' });
  }
});

export default router;
