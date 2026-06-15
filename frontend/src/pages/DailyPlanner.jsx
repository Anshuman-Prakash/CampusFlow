import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, Chip, Avatar, Button } from '@mui/material';
import { AutoAwesome, Schedule, CheckCircle } from '@mui/icons-material';
import { staggerContainer, staggerItem } from '../utils/animations';

const DailyPlanner = () => {
  const schedule = [
    { time: '09:00 AM', title: 'Data Structures Class', type: 'class', status: 'completed' },
    { time: '11:00 AM', title: 'DBMS Lab', type: 'lab', status: 'completed' },
    { time: '02:00 PM', title: 'Computer Networks Class', type: 'class', status: 'upcoming' },
    { time: '04:00 PM', title: 'Complete DSA Assignment', type: 'assignment', status: 'pending' },
    { time: '06:00 PM', title: 'Study Session - DBMS', type: 'study', status: 'pending' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Smart Daily Planner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-generated personalized schedule for today
          </Typography>
        </Box>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AutoAwesome sx={{ fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Good Morning! Here's your day
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              You have 3 classes, 1 assignment due, and attendance warning in Computer Networks.
            </Typography>
            <Button variant="contained" sx={{ background: 'white', color: '#6366F1', '&:hover': { background: 'rgba(255,255,255,0.9)' } }}>
              Regenerate Plan
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Grid container spacing={3}>
        {schedule.map((item, index) => (
          <Grid item xs={12} key={index}>
            <motion.div variants={staggerItem}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                      <Schedule />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={item.status}
                      color={item.status === 'completed' ? 'success' : item.status === 'upcoming' ? 'primary' : 'warning'}
                      icon={item.status === 'completed' ? <CheckCircle /> : undefined}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default DailyPlanner;
