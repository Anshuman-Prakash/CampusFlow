import Task from '../models/Task.model.js';

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const tasks = await Task.find(filter).sort({ deadline: 1, priority: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get today's tasks
export const getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      user: req.user.id,
      status: { $ne: 'Completed' },
      deadline: { $gte: today, $lt: tomorrow },
    }).sort({ priority: -1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get weekly tasks
export const getWeeklyTasks = async (req, res) => {
  try {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const tasks = await Task.find({
      user: req.user.id,
      status: { $ne: 'Completed' },
      deadline: { $gte: today, $lte: weekFromNow },
    }).sort({ deadline: 1 });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get weekly tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create task
export const createTask = async (req, res) => {
  try {
    const task = new Task({
      user: req.user.id,
      ...req.body,
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };
    if (status === 'Completed') {
      updateData.completedAt = new Date();
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task status updated',
      data: task,
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
