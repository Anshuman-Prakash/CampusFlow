import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { Google, AutoAwesome } from '@mui/icons-material';
import { authAPI, onboardingAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { slideUp } from '../utils/animations';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setAuth(response.data.user, response.data.token);
      
      // Simply navigate to dashboard - it will check onboarding status
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // VITE_API_URL already includes /api, so just add /auth/google
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Blobs */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container maxWidth="sm">
        <motion.div {...slideUp}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 5 }}>
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Box
                  component="img"
                  src="/assets/logo.png"
                  alt="CampusFlow Logo"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                Sign in to continue to CampusFlow
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{ py: 1.5, mb: 3 }}
              >
                Continue with Google
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 600 }}>
                  Sign up
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
