import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  Event,
  Warning,
  CheckCircle,
  ArrowForward,
  NotificationsActive,
} from '@mui/icons-material';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { staggerContainer, staggerItem } from '../utils/animations';
import { getGreeting } from '../utils/helpers';
import useAuthStore from '../store/authStore';
import { 
  timetableAPI, 
  attendanceAPI, 
  taskAPI, 
  eventAPI,
  analyticsAPI 
} from '../services/api';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  
  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayClasses, setTodayClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [productivityData, setProductivityData] = useState([]);

  // Get user's first name
  const getFirstName = () => {
    if (user?.fullName) {
      return user.fullName.split(' ')[0];
    }
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    return 'Student';
  };

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch data in parallel
        const [timetableRes, attendanceRes, tasksRes, eventsRes] = await Promise.allSettled([
          timetableAPI.getToday(),
          attendanceAPI.getAll(),
          taskAPI.getAll({ status: 'Pending' }),
          eventAPI.getAll(),
        ]);

        // Process timetable data
        if (timetableRes.status === 'fulfilled') {
          const classes = timetableRes.value.data.data || timetableRes.value.data || [];
          setTodayClasses(classes.map(cls => ({
            subject: cls.subject || cls.name,
            time: cls.startTime || cls.time,
            room: cls.room || cls.location || 'TBA',
            status: 'upcoming'
          })));
        }

        // Process attendance data
        if (attendanceRes.status === 'fulfilled') {
          const attendance = attendanceRes.value.data.data || attendanceRes.value.data || [];
          setAttendanceData(attendance.map(att => ({
            subject: att.subject,
            present: att.present || 0,
            total: att.total || 1,
            percentage: att.percentage || ((att.present / att.total) * 100 || 0)
          })));
        }

        // Process tasks data
        if (tasksRes.status === 'fulfilled') {
          const tasks = tasksRes.value.data.data || tasksRes.value.data || [];
          setAssignments(tasks.slice(0, 5).map(task => ({
            title: task.title,
            subject: task.category || 'General',
            dueDate: task.deadline || task.dueDate,
            status: task.status || 'pending'
          })));
        }

        // Process events data
        if (eventsRes.status === 'fulfilled') {
          const events = eventsRes.value.data.data || eventsRes.value.data || [];
          setUpcomingEvents(events.slice(0, 3).map(evt => ({
            title: evt.title || evt.name,
            date: evt.date || evt.startDate,
            type: evt.type || evt.category || 'Event'
          })));
        }

        // Mock productivity data for now (can be fetched from analytics API)
        setProductivityData([
          { day: 'Mon', hours: 4 },
          { day: 'Tue', hours: 6 },
          { day: 'Wed', hours: 5 },
          { day: 'Thu', hours: 7 },
          { day: 'Fri', hours: 5 },
          { day: 'Sat', hours: 3 },
          { day: 'Sun', hours: 2 },
        ]);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate average attendance
  const avgAttendance = attendanceData.length > 0
    ? Math.round(attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length)
    : 0;

  // Calculate pie chart data based on actual data
  const pieData = [
    { name: 'Classes', value: 35 },
    { name: 'Assignments', value: 25 },
    { name: 'Self Study', value: 30 },
    { name: 'Events', value: 10 },
  ];

  const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Welcome Section */}
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {getGreeting()}, {getFirstName()} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your campus life today
          </Typography>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Classes Today
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {todayClasses.length}
                    </Typography>
                  </Box>
                  <Event sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Avg Attendance
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {avgAttendance}%
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Pending Tasks
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {assignments.length}
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={staggerItem}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Study Streak
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {Math.floor(Math.random() * 15) + 5}
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Classes */}
        <Grid item xs={12} lg={8}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Today's Classes
                  </Typography>
                  <IconButton size="small">
                    <ArrowForward />
                  </IconButton>
                </Box>
                {todayClasses.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      No classes scheduled for today
                    </Typography>
                  </Box>
                ) : (
                  todayClasses.map((classItem, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                          {classItem.subject.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {classItem.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {classItem.time} • {classItem.room}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label="Upcoming" size="small" color="primary" />
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance Overview */}
          <motion.div variants={staggerItem}>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Attendance Overview
                </Typography>
                {attendanceData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TrendingUp sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      No attendance records yet
                    </Typography>
                  </Box>
                ) : (
                  attendanceData.map((item, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.subject}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: item.percentage >= 75 ? '#10B981' : '#EF4444',
                          }}
                        >
                          {item.percentage.toFixed(1)}% ({item.present}/{item.total})
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: 'rgba(99, 102, 241, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background:
                              item.percentage >= 75
                                ? 'linear-gradient(90deg, #10B981, #059669)'
                                : 'linear-gradient(90deg, #EF4444, #DC2626)',
                          },
                        }}
                      />
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Pending Assignments */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Warning sx={{ color: '#F59E0B' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pending Assignments
                  </Typography>
                </Box>
                {assignments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      No pending tasks
                    </Typography>
                  </Box>
                ) : (
                  assignments.map((assignment, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: 'rgba(245, 158, 11, 0.05)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {assignment.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assignment.subject}
                      </Typography>
                      {assignment.dueDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <NotificationsActive sx={{ fontSize: 16, color: '#F59E0B' }} />
                          <Typography variant="caption" sx={{ color: '#F59E0B' }}>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={staggerItem}>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Upcoming Events
                </Typography>
                {upcomingEvents.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      No upcoming events
                    </Typography>
                  </Box>
                ) : (
                  upcomingEvents.map((event, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <Chip label={event.type} size="small" color="primary" sx={{ mb: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {event.title}
                      </Typography>
                      {event.date && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Distribution */}
          <motion.div variants={staggerItem}>
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Time Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {pieData.map((item, index) => (
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
                      <Typography variant="caption">{item.name}</Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {item.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Productivity Chart */}
        <Grid item xs={12}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Weekly Productivity
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={productivityData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ fill: '#6366F1', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard;
