import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import connectDB from './config/database.js';
import './config/passport.js'; // Import passport configuration
import { testCloudinaryConnection } from './config/cloudinary.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import noticeRoutes from './routes/notice.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import eventRoutes from './routes/event.routes.js';
import placementRoutes from './routes/placement.routes.js';
import knowledgeBaseRoutes from './routes/knowledgeBase.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import plannerRoutes from './routes/planner.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { listAvailableModels } from './services/gemini.service.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import timetableRoutes from './routes/timetable.routes.js';
import taskRoutes from './routes/task.routes.js';
import goalRoutes from './routes/goal.routes.js';
import attendanceEnhancedRoutes from './routes/attendanceEnhanced.routes.js';
import dailyPlannerRoutes from './routes/dailyPlanner.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Test Cloudinary connection (optional - only if credentials provided)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  testCloudinaryConnection();
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
}));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/knowledge-base', knowledgeBaseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/upload', uploadRoutes);

// New onboarding & enhanced features
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/attendance-enhanced', attendanceEnhancedRoutes);
app.use('/api/daily-planner', dailyPlannerRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    services: {
      mongodb: 'connected',
      cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      googleOAuth: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured',
    }
  });
});

// Debug endpoint for Gemini models (development only)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/gemini-models', async (req, res) => {
    try {
      const modelInfo = await listAvailableModels();
      res.json(modelInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 CampusFlow Backend`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
