import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  AutoAwesome,
  Dashboard,
  EventNote,
  InsertChart,
  Description,
  School,
  Work,
  SmartToy,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import { fadeIn, slideUp, staggerContainer, staggerItem, floatingAnimation } from '../utils/animations';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SmartToy />,
      title: 'AI Campus Assistant',
      description: 'Your personal AI assistant for classes, attendance, exams, and campus queries',
    },
    {
      icon: <Description />,
      title: 'Notice Summarizer',
      description: 'Automatically summarize PDFs and extract deadlines, venues, and action items',
    },
    {
      icon: <EventNote />,
      title: 'Smart Daily Planner',
      description: 'AI-generated personalized schedule with automated reminders',
    },
    {
      icon: <InsertChart />,
      title: 'Attendance Tracker',
      description: 'Track attendance with risk indicators and required classes calculation',
    },
    {
      icon: <School />,
      title: 'Knowledge Base',
      description: 'Upload handbooks and query them with RAG-powered AI',
    },
    {
      icon: <Work />,
      title: 'Placement Assistant',
      description: 'Resume analysis, eligibility checker, and interview preparation',
    },
  ];

  const problems = [
    'WhatsApp groups flooding with unorganized information',
    'Missing important deadlines buried in emails',
    'Scattered data across multiple portals',
    'Manual attendance tracking and calculation',
    'Difficulty finding campus policies and rules',
    'No centralized placement preparation',
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'CS Student, IIT Delhi',
      avatar: 'P',
      text: 'CampusFlow transformed how I manage my academic life. No more missed deadlines!',
    },
    {
      name: 'Rahul Verma',
      role: 'ECE Student, NIT Trichy',
      avatar: 'R',
      text: 'The AI assistant is incredible. It answers all my campus queries instantly.',
    },
    {
      name: 'Ananya Patel',
      role: 'MBA Student, IIM Bangalore',
      avatar: 'A',
      text: 'Placement preparation module helped me land my dream job. Highly recommended!',
    },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Navigation - Compact with visual width constraint */}
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            maxWidth: '1200px',
            width: '100%',
            px: { xs: 2, sm: 3 },
            py: 1,
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Toolbar 
              disableGutters 
              sx={{ 
                minHeight: '52px !important',
                height: '52px',
                px: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="img"
                  src="/assets/logo.png"
                  alt="CampusFlow Logo"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1E293B', 
                    fontSize: '17px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  CampusFlow
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/login')} 
                  size="small"
                  sx={{ 
                    borderColor: '#667eea',
                    color: '#667eea',
                    px: 1.8,
                    py: 0.4,
                    minHeight: '32px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '6px',
                    '&:hover': {
                      borderColor: '#5568d3',
                      background: 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/signup')}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    px: 1.8,
                    py: 0.4,
                    minHeight: '32px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(102, 126, 234, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6b3f94 100%)',
                      boxShadow: '0 3px 8px rgba(102, 126, 234, 0.3)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Toolbar>
          </Box>
        </Box>
      </AppBar>

      {/* Hero Section - Centered vertically */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 7, md: 8 },
          pb: { xs: 6, md: 8 },
        }}
      >
        {/* Floating Blobs */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 300,
            height: 300,
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
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div {...slideUp}>
                <Typography
                  variant="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  AI Operating System for{' '}
                  <span style={{ background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Student Life
                  </span>
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, lineHeight: 1.8 }}>
                  Eliminate information chaos across WhatsApp, emails, and portals. Your entire campus life, powered by AI, in one beautiful platform.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/signup')}
                    sx={{
                      background: 'white',
                      color: '#6366F1',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Start Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div {...floatingAnimation}>
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Box sx={{ background: 'white', borderRadius: 3, p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                      Good Morning, Shivam 👋
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                          <CardContent>
                            <Typography sx={{ color: 'white', fontSize: 12, mb: 1 }}>Classes Today</Typography>
                            <Typography sx={{ color: 'white', fontSize: 28, fontWeight: 700 }}>3</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>
                          <CardContent>
                            <Typography sx={{ color: 'white', fontSize: 12, mb: 1 }}>Attendance</Typography>
                            <Typography sx={{ color: 'white', fontSize: 28, fontWeight: 700 }}>86%</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Problem Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div {...slideUp}>
          <Typography variant="h2" align="center" sx={{ mb: 2, fontWeight: 700 }}>
            Student Life is{' '}
            <span className="gradient-text">Chaotic</span>
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Sound familiar?
          </Typography>
        </motion.div>
        <Grid container spacing={3}>
          {problems.map((problem, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CheckCircle sx={{ color: '#EF4444', mt: 0.5 }} />
                    <Typography variant="body1">{problem}</Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ background: '#F8FAFC', py: 10 }}>
        <Container maxWidth="lg">
          <motion.div {...slideUp}>
            <Typography variant="h2" align="center" sx={{ mb: 2, fontWeight: 700 }}>
              One Platform, <span className="gradient-text">Infinite Possibilities</span>
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 8, color: 'text.secondary' }}>
              Everything you need to excel in campus life
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card sx={{ height: '100%', p: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: 'white',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div {...slideUp}>
          <Typography variant="h2" align="center" sx={{ mb: 2, fontWeight: 700 }}>
            Loved by <span className="gradient-text">Students</span>
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 8, color: 'text.secondary' }}>
            See what students are saying
          </Typography>
        </motion.div>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card sx={{ p: 4, height: '100%' }}>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div {...slideUp}>
            <Typography variant="h2" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
              Ready to Transform Your Campus Life?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
              Join thousands of students already using CampusFlow
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                background: 'white',
                color: '#6366F1',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Get Started Free
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer - Redesigned with full logo, credits, and copyright */}
      <Box sx={{ background: '#1E293B', py: 8, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left: Logo & Brand */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src="/assets/logo.png"
                    alt="CampusFlow Logo"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: 'white' }}>
                      CampusFlow
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
                      AI Operating System for Student Life
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Center: Made with Love */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Made with ❤️ by
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 600,
                  }}
                >
                  Shivam Sharma & Anshuman Prakash
                </Typography>
              </Box>
            </Grid>

            {/* Right: Copyright */}
            <Grid item xs={12} md={4}>
              <Typography 
                variant="body2" 
                align="right" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                }}
              >
                © 2026 CampusFlow. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
