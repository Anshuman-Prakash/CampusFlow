import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Assignment from '../models/Assignment.model.js';

const router = express.Router();

// Get all assignments
router.get('/', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
  }
});

// Create assignment
router.post('/', protect, async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create assignment' });
  }
});

// Update assignment
router.put('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update assignment' });
  }
});

// Delete assignment
router.delete('/:id', protect, async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete assignment' });
  }
});

export default router;
