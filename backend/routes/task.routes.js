import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getAllTasks,
  getTodayTasks,
  getWeeklyTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/task.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all tasks
router.get('/', getAllTasks);

// Get today's tasks
router.get('/today', getTodayTasks);

// Get weekly tasks
router.get('/week', getWeeklyTasks);

// Create task
router.post('/', createTask);

// Update task
router.put('/:id', updateTask);

// Update task status
router.patch('/:id/status', updateTaskStatus);

// Delete task
router.delete('/:id', deleteTask);

export default router;
