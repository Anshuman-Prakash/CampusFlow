import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Card,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Check, ArrowBack, Celebration } from '@mui/icons-material';
import { onboardingAPI } from '../../services/api';

const RoutineSetup = ({ onComplete, onBack }) => {
  const [routine, setRoutine] = useState({
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    studyHours: 4,
    gym: false,
    codingPractice: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setRoutine({ ...routine, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Convert 24-hour format to 12-hour format for backend
      const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };

      const formattedRoutine = {
        wakeUpTime: formatTime(routine.wakeUpTime),
        sleepTime: formatTime(routine.sleepTime),
        studyHours: routine.studyHours,
        gym: routine.gym,
        codingPractice: routine.codingPractice,
      };

      console.log('Completing onboarding with routine:', formattedRoutine);
      const response = await onboardingAPI.completeOnboarding({ routine: formattedRoutine });
      console.log('Onboarding complete response:', response);
      
      // Verify completion from the response
      if (response.data?.success) {
        console.log('✅ Onboarding marked complete successfully');
        
        // Clear any cached data
        localStorage.removeItem('onboardingComplete');
        
        // Wait for database to sync
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Force a complete page reload to refresh all state
        console.log('Redirecting to dashboard...');
        window.location.replace('/dashboard');
      } else {
        throw new Error('Onboarding completion was not confirmed by server');
      }
    } catch (err) {
      console.error('Complete onboarding error:', err);
      setError(err.response?.data?.message || 'Failed to complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        ⏰ Set up your daily routine
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Help us create the perfect schedule for you
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Alert severity="success" icon={<Celebration />} sx={{ mb: 3 }}>
          Awesome! Setting up your personalized dashboard...
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sleep Schedule */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              🌅 Sleep Schedule
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Wake Up Time"
                  type="time"
                  value={routine.wakeUpTime}
                  onChange={(e) => handleChange('wakeUpTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sleep Time"
                  type="time"
                  value={routine.sleepTime}
                  onChange={(e) => handleChange('sleepTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Study Hours */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              📚 Preferred Study Hours
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={routine.studyHours}
                onChange={(e, value) => handleChange('studyHours', value)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value} hours`}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              How many hours per day do you want to dedicate to studying?
            </Typography>
          </Card>
        </Grid>

        {/* Activities */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              🏃 Daily Activities
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    background: routine.gym 
                      ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' 
                      : 'transparent',
                    border: routine.gym 
                      ? '2px solid #667eea' 
                      : '1px solid rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={routine.gym}
                        onChange={(e) => handleChange('gym', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#667eea',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#667eea',
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          🏋️ Gym / Exercise
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Include workout time in schedule
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    background: routine.codingPractice 
                      ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' 
                      : 'transparent',
                    border: routine.codingPractice 
                      ? '2px solid #667eea' 
                      : '1px solid rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={routine.codingPractice}
                        onChange={(e) => handleChange('codingPractice', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#667eea',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#667eea',
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          💻 Coding Practice
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Include DSA/coding in schedule
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Almost done!</strong> Based on your routine, we'll create a personalized daily
          schedule with AI-powered recommendations.
        </Typography>
      </Alert>

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
          size="large"
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Check />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{ px: 5 }}
        >
          {loading ? 'Completing Setup...' : 'Complete Setup'}
        </Button>
      </Box>
    </Box>
  );
};

export default RoutineSetup;
