import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Warning, CheckCircle, TrendingUp } from '@mui/icons-material';
import { staggerContainer, staggerItem } from '../utils/animations';
import { calculatePercentage, getAttendanceStatus } from '../utils/helpers';
import { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

const AttendanceTracker = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAll();
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (subjects.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No attendance data available. Start tracking your attendance!
      </Alert>
    );
  }

  const overallAttendance = {
    present: subjects.reduce((sum, s) => sum + s.present, 0),
    absent: subjects.reduce((sum, s) => sum + s.absent, 0),
    total: subjects.reduce((sum, s) => sum + s.total, 0),
  };
  overallAttendance.percentage = subjects.length > 0 
    ? (subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length).toFixed(2)
    : 0;

  const pieData = subjects.map((subject) => ({
    name: subject.subject,
    value: subject.present,
  }));

  const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Attendance Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your attendance and maintain the required percentage
          </Typography>
        </Box>
      </motion.div>

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <motion.div variants={staggerItem}>
            <Card sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white' }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Overall Attendance
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  {overallAttendance.percentage}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {overallAttendance.present} / {overallAttendance.total} classes
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={8}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Subject-wise Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Subject Cards */}
      <Grid container spacing={3}>
        {subjects.map((subject, index) => {
          const status = getAttendanceStatus(subject.percentage);
          const requiredClasses = Math.max(0, Math.ceil((75 * subject.total - 100 * subject.present) / 25));
          
          return (
            <Grid item xs={12} md={6} key={subject._id}>
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {subject.subject}
                      </Typography>
                      <Chip
                        label={status.status}
                        size="small"
                        sx={{
                          background: status.color,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: status.color }}>
                        {subject.percentage.toFixed(1)}%
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          Present: {subject.present}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Absent: {subject.absent}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: {subject.total}
                        </Typography>
                      </Box>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={subject.percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        mb: 2,
                        background: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: status.color,
                        },
                      }}
                    />

                    {subject.percentage < 75 ? (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(239, 68, 68, 0.05)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Warning sx={{ color: '#EF4444', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#EF4444' }}>
                          Attend {requiredClasses} more {requiredClasses === 1 ? 'class' : 'classes'} to reach 75%
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#10B981' }}>
                          Great! You're above the required attendance
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </motion.div>
  );
};

export default AttendanceTracker;
