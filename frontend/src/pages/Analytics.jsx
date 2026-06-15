import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, Assignment, School, CheckCircle } from '@mui/icons-material';
import { staggerContainer, staggerItem } from '../utils/animations';
import { useState, useEffect } from 'react';
import { analyticsAPI, attendanceAPI } from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [productivityRes, weeklyRes, attendanceRes] = await Promise.all([
        analyticsAPI.getProductivity(),
        analyticsAPI.getWeeklyReport(),
        attendanceAPI.getAll(),
      ]);

      if (productivityRes.data.success) {
        setStats(productivityRes.data.data);
      }

      if (weeklyRes.data.success) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const formattedWeekly = days.map((day, index) => ({
          day,
          hours: weeklyRes.data.data.weeklyStudyHours[index] || 0,
          attendance: weeklyRes.data.data.attendanceTrend[index] || 0,
        }));
        setWeeklyData(formattedWeekly);
      }

      if (attendanceRes.data.success) {
        const subjects = attendanceRes.data.data;
        setPerformanceData(
          subjects.map((s) => ({
            subject: s.subject,
            score: s.percentage,
          }))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
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

  const productivityData = [
    { name: 'Classes', value: 35 },
    { name: 'Assignments', value: 25 },
    { name: 'Self Study', value: 30 },
    { name: 'Events', value: 10 },
  ];

  const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981'];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Productivity Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your academic performance and productivity
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Study Streak
                  </Typography>
                  <TrendingUp sx={{ color: '#6366F1' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats?.studyStreak || 0} Days
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <CheckCircle sx={{ color: '#10B981' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats?.assignmentsCompleted || 0}/{(stats?.assignmentsCompleted || 0) + (stats?.assignmentsPending || 0)}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Score
                  </Typography>
                  <School sx={{ color: '#8B5CF6' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats?.averageAttendance || 0}%
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    This Week
                  </Typography>
                  <Assignment sx={{ color: '#06B6D4' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  32h
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Weekly Study Hours
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hours" stroke="#6366F1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Subject Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Time Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productivityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 3 }}>
                  {productivityData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: COLORS[index],
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Analytics;
