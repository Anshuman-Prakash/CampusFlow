import Goal from '../models/Goal.model.js';

// Get all goals
export const getAllGoals = async (req, res) => {
  try {
    const { status, recurrence } = req.query;
    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (recurrence) filter.recurrence = recurrence;

    const goals = await Goal.find(filter).sort({ deadline: 1 });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create goal
export const createGoal = async (req, res) => {
  try {
    const goal = new Goal({
      user: req.user.id,
      ...req.body,
    });

    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal,
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: goal,
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update goal progress
export const updateGoalProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        progress,
        status: progress >= 100 ? 'Completed' : 'Active'
      },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.json({
      success: true,
      message: 'Goal progress updated',
      data: goal,
    });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
