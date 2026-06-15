import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Try getting token from localStorage first, then from auth-storage (Zustand persist)
  let token = localStorage.getItem('token');
  
  if (!token) {
    // Try getting from Zustand persist storage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      } catch (e) {
        console.error('Error parsing auth storage:', e);
      }
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/signup', data),
  signup: (data) => api.post('/auth/signup', data),
  googleAuth: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  mark: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  getProductivity: () => api.get('/analytics/productivity'),
  getWeeklyReport: () => api.get('/analytics/weekly-report'),
};

// Assignment APIs
export const assignmentAPI = {
  getAll: () => api.get('/assignments'),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Event APIs
export const eventAPI = {
  getAll: () => api.get('/events'),
  register: (id) => api.post(`/events/${id}/register`),
  bookmark: (id) => api.post(`/events/${id}/bookmark`),
  unbookmark: (id) => api.delete(`/events/${id}/bookmark`),
};

// Notice APIs
export const noticeAPI = {
  getAll: () => api.get('/notices'),
  getById: (id) => api.get(`/notices/${id}`),
};

// Placement APIs
export const placementAPI = {
  checkEligibility: (data) => api.post('/placement/eligibility', data),
  analyzeResume: (formData) => api.post('/placement/resume-analysis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Knowledge Base APIs
export const knowledgeBaseAPI = {
  query: (data) => api.post('/knowledge-base/query', data),
  uploadDocument: (formData) => api.post('/knowledge-base/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getDocuments: () => api.get('/knowledge-base/documents'),
};

// Chat/AI APIs
export const chatAPI = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
};

// Onboarding APIs
export const onboardingAPI = {
  getStatus: () => api.get('/onboarding/status'),
  saveStep1: (data) => api.post('/onboarding/step1', data),
  saveStep3: (data) => api.post('/onboarding/step3', data),
  saveStep4: (data) => api.post('/onboarding/step4', data),
  saveStep5: (data) => api.post('/onboarding/step5', data),
  completeOnboarding: (data) => api.post('/onboarding/complete', data),
  complete: (data) => api.post('/onboarding/complete', data),
};

// Timetable APIs
export const timetableAPI = {
  uploadTimetable: (formData) => api.post('/timetable/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  upload: (formData) => api.post('/timetable/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  saveManualTimetable: (data) => api.post('/timetable/manual', data),
  saveManual: (data) => api.post('/timetable/manual', data),
  getAll: () => api.get('/timetable'),
  getTimetable: () => api.get('/timetable'),
  getToday: () => api.get('/timetable/today'),
  update: (classId, data) => api.put(`/timetable/${classId}`, data),
  delete: (classId) => api.delete(`/timetable/${classId}`),
};

// Task APIs
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getToday: () => api.get('/tasks/today'),
  getWeek: () => api.get('/tasks/week'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Goal APIs
export const goalAPI = {
  getAll: (params) => api.get('/goals', { params }),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  updateProgress: (id, progress) => api.patch(`/goals/${id}/progress`, { progress }),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Attendance Enhanced APIs
export const attendanceEnhancedAPI = {
  mark: (data) => api.post('/attendance-enhanced/mark', data),
  getIntelligence: () => api.get('/attendance-enhanced/intelligence'),
  getAlerts: () => api.get('/attendance-enhanced/alerts'),
  bulkSetup: (data) => api.post('/attendance-enhanced/bulk', data),
};

// Daily Planner APIs
export const dailyPlannerAPI = {
  getBriefing: () => api.get('/daily-planner/briefing'),
  getToday: () => api.get('/daily-planner/today'),
  regenerate: () => api.post('/daily-planner/generate'),
};

export default api;
