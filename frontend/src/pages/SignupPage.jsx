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
  Grid,
} from '@mui/material';
import { Google, AutoAwesome } from '@mui/icons-material';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { slideUp } from '../utils/animations';

const SignupPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    branch: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      setAuth(response.data.user, response.data.token);
      
      // New users always go to dashboard, which will redirect to onboarding
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div {...slideUp}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CardContent sx={{ p: 5 }}>
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
                Create Account
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                Join CampusFlow and transform your student life
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
                onClick={handleGoogleSignup}
                sx={{ py: 1.5, mb: 3 }}
              >
                Sign up with Google
              </Button>

              <Typography variant="body2" align="center" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignupPage;
