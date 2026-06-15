import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  IconButton,
} from '@mui/material';
import { ArrowForward, ArrowBack, Add, Delete } from '@mui/icons-material';
import { onboardingAPI } from '../../services/api';

const TasksSetup = ({ onNext, onBack }) => {
  const [tasks, setTasks] = useState([
    {
      title: '',
      category: 'Academic',
      priority: 'Medium',
      recurrence: 'Weekly',
      deadline: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const addNewTask = () => {
    setTasks([
      ...tasks,
      {
        title: '',
        category: 'Academic',
        priority: 'Medium',
        recurrence: 'Weekly',
        deadline: '',
      },
    ]);
  };

  const removeTask = (index) => {
    if (tasks.length > 1) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
  };

  const handleSubmit = async () => {
    // Filter valid tasks
    const validTasks = tasks.filter((task) => task.title && task.deadline);

    if (validTasks.length === 0) {
      setError('Please add at least one task with title and deadline');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onboardingAPI.saveStep5({ tasks: validTasks });
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        ✅ Set up recurring tasks & goals
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create weekly or monthly tasks to stay organized
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        Examples: "Complete 10 Leetcode Problems", "Finish Project Module", "Prepare Resume"
      </Alert>

      {tasks.map((task, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={task.title}
                onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                placeholder="e.g., Complete 5 Leetcode Questions"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Category"
                value={task.category}
                onChange={(e) => handleTaskChange(index, 'category', e.target.value)}
              >
                <MenuItem value="Academic">Academic</MenuItem>
                <MenuItem value="Competitive Programming">Competitive Programming</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Research">Research</MenuItem>
                <MenuItem value="Skill Development">Skill Development</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={task.priority}
                onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Recurrence"
                value={task.recurrence}
                onChange={(e) => handleTaskChange(index, 'recurrence', e.target.value)}
              >
                <MenuItem value="None">One-time</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Deadline"
                type="date"
                value={task.deadline}
                onChange={(e) => handleTaskChange(index, 'deadline', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            {tasks.length > 1 && (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  color="error"
                  onClick={() => removeTask(index)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Card>
      ))}

      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addNewTask}
        sx={{ mb: 3 }}
      >
        Add Another Task
      </Button>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="text"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
          </Button>

          <Button
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{ px: 4 }}
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TasksSetup;
