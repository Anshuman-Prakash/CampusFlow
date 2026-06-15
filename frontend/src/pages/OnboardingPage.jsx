import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardingAPI } from '../services/api';

// Step components
import BasicProfile from '../components/onboarding/BasicProfile';
import TimetableSetup from '../components/onboarding/TimetableSetup';
import AttendanceSetup from '../components/onboarding/AttendanceSetup';
import GoalsSetup from '../components/onboarding/GoalsSetup';
import TasksSetup from '../components/onboarding/TasksSetup';
import RoutineSetup from '../components/onboarding/RoutineSetup';

const steps = [
  'Basic Profile',
  'Timetable',
  'Attendance',
  'Goals',
  'Tasks',
  'Daily Routine',
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await onboardingAPI.getStatus();
        
        if (response.data.completed) {
          // Already completed, go to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // Set current step
          setActiveStep(response.data.currentStep || 0);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
        setError('Failed to load onboarding status');
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.step !== undefined) {
      setActiveStep(location.state.step);
      setLoading(false);
    } else {
      checkOnboardingStatus();
    }
  }, [location, navigate]);

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  const renderStepContent = (step) => {
    const stepVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    switch (step) {
      case 0:
        return (
          <motion.div
            key="step-0"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <BasicProfile onNext={handleNext} />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <TimetableSetup onNext={handleNext} onBack={handleBack} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <AttendanceSetup onNext={handleNext} onBack={handleBack} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <GoalsSetup onNext={handleNext} onBack={handleBack} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step-4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <TasksSetup onNext={handleNext} onBack={handleBack} />
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key="step-5"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <RoutineSetup onComplete={handleComplete} onBack={handleBack} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome to CampusFlow! 🎓
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
            }}
          >
            Let's set up your personalized campus assistant
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            minHeight: 400,
          }}
        >
          <AnimatePresence mode="wait">
            {renderStepContent(activeStep)}
          </AnimatePresence>

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default OnboardingPage;
