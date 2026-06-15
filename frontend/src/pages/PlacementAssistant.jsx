import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Chip, LinearProgress, Alert, CircularProgress } from '@mui/material';
import { CloudUpload, CheckCircle, TrendingUp, School } from '@mui/icons-material';
import { staggerContainer, staggerItem } from '../utils/animations';
import { useState } from 'react';
import { placementAPI } from '../services/api';

const PlacementAssistant = () => {
  const [cgpa, setCgpa] = useState('');
  const [backlogs, setBacklogs] = useState('');
  const [attendance, setAttendance] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  
  const [resumeFile, setResumeFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  const checkEligibility = async () => {
    if (!cgpa || !backlogs || !attendance) {
      alert('Please fill all fields');
      return;
    }

    try {
      setCheckingEligibility(true);
      const response = await placementAPI.checkEligibility({
        cgpa: parseFloat(cgpa),
        backlogs: parseInt(backlogs),
        attendance: parseInt(attendance),
      });

      if (response.data.success) {
        setEligibilityResult(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check eligibility');
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setResumeFile(file);

    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await placementAPI.analyzeResume(formData);
      if (response.data.success) {
        setResumeAnalysis(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const resources = [
    { category: 'DSA', items: ['LeetCode Problems', 'HackerRank', 'CodeChef', 'GeeksforGeeks'] },
    { category: 'Behavioral', items: ['STAR Method', 'Common Questions', 'Mock Interviews'] },
    { category: 'Technical', items: ['System Design', 'OOP Concepts', 'Database Design', 'OS Fundamentals'] },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Placement Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resume analysis, eligibility check, and interview preparation
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Resume Upload */}
        <Grid item xs={12} md={6}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Resume Analyzer
                </Typography>
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '2px dashed rgba(99, 102, 241, 0.3)',
                    borderRadius: 2,
                    background: 'rgba(99, 102, 241, 0.02)',
                    mb: 3,
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: '#6366F1', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Upload your resume for AI-powered analysis
                  </Typography>
                  <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="resume-upload"
                    type="file"
                    onChange={handleResumeUpload}
                  />
                  <label htmlFor="resume-upload">
                    <Button variant="contained" component="span" disabled={analyzing}>
                      {analyzing ? 'Analyzing...' : 'Choose PDF'}
                    </Button>
                  </label>
                  {resumeFile && (
                    <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                      {resumeFile.name}
                    </Typography>
                  )}
                </Box>

                {analyzing && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                  </Box>
                )}

                {resumeAnalysis && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Analysis Results:</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Overall Score</Typography>
                        <Typography variant="body2" fontWeight={600}>{resumeAnalysis.score}/100</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={resumeAnalysis.score} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">ATS Score</Typography>
                        <Typography variant="body2" fontWeight={600}>{resumeAnalysis.atsScore}/100</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={resumeAnalysis.atsScore} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Strengths:</Typography>
                    {resumeAnalysis.strengths?.map((strength, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                        ✓ {strength}
                      </Typography>
                    ))}
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Improvements:</Typography>
                    {resumeAnalysis.improvements?.map((improvement, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                        • {improvement}
                      </Typography>
                    ))}
                  </Box>
                )}

                {!resumeAnalysis && !analyzing && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Analysis Features:</Typography>
                    <Chip label="ATS Score" size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label="Keyword Analysis" size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label="Suggestions" size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label="Formatting Check" size="small" sx={{ mb: 1 }} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Eligibility Checker */}
        <Grid item xs={12} md={6}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Eligibility Checker
                </Typography>
                <TextField
                  fullWidth
                  label="CGPA"
                  type="number"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  sx={{ mb: 2 }}
                  inputProps={{ step: '0.01', min: '0', max: '10' }}
                />
                <TextField
                  fullWidth
                  label="Number of Backlogs"
                  type="number"
                  value={backlogs}
                  onChange={(e) => setBacklogs(e.target.value)}
                  sx={{ mb: 2 }}
                  inputProps={{ min: '0' }}
                />
                <TextField
                  fullWidth
                  label="Attendance %"
                  type="number"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  sx={{ mb: 3 }}
                  inputProps={{ min: '0', max: '100' }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={checkEligibility}
                  startIcon={checkingEligibility ? <CircularProgress size={20} /> : <CheckCircle />}
                  disabled={checkingEligibility}
                >
                  {checkingEligibility ? 'Checking...' : 'Check Eligibility'}
                </Button>

                {eligibilityResult && (
                  <Alert 
                    severity={eligibilityResult.eligible ? 'success' : 'warning'} 
                    sx={{ mt: 2 }}
                  >
                    {eligibilityResult.message}
                  </Alert>
                )}

                <Box sx={{ mt: 3, p: 2, background: 'rgba(99, 102, 241, 0.05)', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Minimum Requirements:
                  </Typography>
                  <Typography variant="caption" display="block">
                    • CGPA: 7.0 or above
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Backlogs: 0
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Attendance: 75% or above
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Interview Prep */}
        <Grid item xs={12}>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Interview Preparation Resources
                </Typography>
                <Grid container spacing={3}>
                  {resources.map((resource, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
                          border: '1px solid rgba(99, 102, 241, 0.1)',
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                          {resource.category}
                        </Typography>
                        {resource.items.map((item, idx) => (
                          <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                            • {item}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PlacementAssistant;
