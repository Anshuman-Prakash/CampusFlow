import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import useAuthStore from '../store/authStore';

const AuthCallback = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    // Get token and user from URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuth(user, token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [navigate, setAuth]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
      <Typography variant="h5" sx={{ color: 'white' }}>
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default AuthCallback;
