import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getAllGoals,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
} from '../controllers/goal.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all goals
router.get('/', getAllGoals);

// Create goal
router.post('/', createGoal);

// Update goal
router.put('/:id', updateGoal);

// Update goal progress
router.patch('/:id/progress', updateGoalProgress);

// Delete goal
router.delete('/:id', deleteGoal);

export default router;
