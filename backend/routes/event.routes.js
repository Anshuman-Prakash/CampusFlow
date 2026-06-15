import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Event from '../models/Event.model.js';

const router = express.Router();

// Get all events
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Register for event
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event.registeredUsers.includes(req.user.id)) {
      event.registeredUsers.push(req.user.id);
      await event.save();
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register' });
  }
});

// Bookmark event
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const index = event.bookmarkedBy.indexOf(req.user.id);
    if (index === -1) {
      event.bookmarkedBy.push(req.user.id);
    } else {
      event.bookmarkedBy.splice(index, 1);
    }
    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to bookmark' });
  }
});

export default router;
