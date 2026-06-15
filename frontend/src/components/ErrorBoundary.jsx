import { Component } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Error as ErrorIcon, Refresh } from '@mui/icons-material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            p: 3,
          }}
        >
          <Card sx={{ maxWidth: 500 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ErrorIcon sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Something went wrong
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
