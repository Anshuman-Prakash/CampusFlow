import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Card,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { onboardingAPI } from '../../services/api';

const PRESET_GOALS = [
  { value: 'Improve CGPA', icon: '📈', description: 'Boost your academic performance' },
  { value: 'Placement Preparation', icon: '💼', description: 'Get ready for campus placements' },
  { value: 'Internship Preparation', icon: '🎯', description: 'Secure valuable internships' },
  { value: 'Competitive Programming', icon: '💻', description: 'Master DSA and coding contests' },
  { value: 'Higher Studies', icon: '🎓', description: 'Prepare for Masters/PhD' },
  { value: 'Research', icon: '🔬', description: 'Engage in academic research' },
  { value: 'Skill Development', icon: '🚀', description: 'Learn new technologies' },
  { value: 'Entrepreneurship', icon: '💡', description: 'Start your own venture' },
];

const GoalsSetup = ({ onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [customGoals, setCustomGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoalToggle = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = async () => {
    let finalGoals = [...selectedGoals];

    // Add custom goals
    if (customGoals.trim()) {
      const customGoalsList = customGoals
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g);
      finalGoals = [...finalGoals, ...customGoalsList];
    }

    if (finalGoals.length === 0) {
      setError('Please select or add at least one goal');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onboardingAPI.saveStep4({ goals: finalGoals });
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        🎯 What are your goals this semester?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select your academic and career goals to get personalized recommendations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {PRESET_GOALS.map((goal) => (
          <Grid item xs={12} sm={6} md={6} key={goal.value}>
            <Card
              variant="outlined"
              sx={{
                p: 2,
                cursor: 'pointer',
                border: 2,
                borderColor: selectedGoals.includes(goal.value) 
                  ? 'transparent' 
                  : 'rgba(0, 0, 0, 0.12)',
                background: selectedGoals.includes(goal.value)
                  ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
                  : 'transparent',
                boxShadow: selectedGoals.includes(goal.value)
                  ? '0 0 0 2px #667eea'
                  : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.15)',
                },
              }}
              onClick={() => handleGoalToggle(goal.value)}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedGoals.includes(goal.value)}
                      onChange={() => handleGoalToggle(goal.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h5">{goal.icon}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {goal.value}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {goal.description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Custom Goals */}
      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          ✏️ Add Custom Goals
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Enter custom goals separated by commas (e.g., Learn React, Build Portfolio)"
          value={customGoals}
          onChange={(e) => setCustomGoals(e.target.value)}
        />
      </Card>

      {/* Selected Goals Preview */}
      {selectedGoals.length > 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Selected Goals ({selectedGoals.length}):
          </Typography>
          {selectedGoals.map((goal, index) => (
            <Typography key={index} variant="body2">
              • {goal}
            </Typography>
          ))}
        </Alert>
      )}

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
  );
};

export default GoalsSetup;
