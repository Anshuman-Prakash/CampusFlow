import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import { onboardingAPI } from './services/api';
import { CircularProgress, Box } from '@mui/material';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthCallback from './pages/AuthCallback';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import NoticeSummarizer from './pages/NoticeSummarizer';
import DailyPlanner from './pages/DailyPlanner';
import AttendanceTracker from './pages/AttendanceTracker';
import KnowledgeBase from './pages/KnowledgeBase';
import PlacementAssistant from './pages/PlacementAssistant';
import EventManagement from './pages/EventManagement';
import Analytics from './pages/Analytics';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Protected Route Component - Checks authentication only
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Dashboard Protected Route - Checks both auth and onboarding
const DashboardProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        // Force a fresh check without cache
        const response = await onboardingAPI.getStatus();
        
        // Handle nested response structure (response.data.data.completed)
        const completed = response.data?.data?.completed || response.data?.completed || false;
        
        setOnboardingComplete(completed);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        // If error, assume onboarding not complete
        setOnboardingComplete(false);
      } finally {
        setLoading(false);
      }
    };

    // Always re-check when navigating to dashboard
    checkOnboarding();
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardProtectedRoute>
              <DashboardLayout />
            </DashboardProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="notice-summarizer" element={<NoticeSummarizer />} />
          <Route path="daily-planner" element={<DailyPlanner />} />
          <Route path="attendance" element={<AttendanceTracker />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="placement" element={<PlacementAssistant />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
