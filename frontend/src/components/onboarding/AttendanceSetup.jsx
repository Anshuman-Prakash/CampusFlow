import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { ArrowForward, ArrowBack, Add, Delete } from '@mui/icons-material';
import { onboardingAPI } from '../../services/api';

const AttendanceSetup = ({ onNext, onBack }) => {
  const [enableTracking, setEnableTracking] = useState(true);
  const [subjects, setSubjects] = useState([
    { subject: '', conducted: '', attended: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const addNewSubject = () => {
    setSubjects([...subjects, { subject: '', conducted: '', attended: '' }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const updatedSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(updatedSubjects);
    }
  };

  const calculatePercentage = (attended, conducted) => {
    if (!attended || !conducted || conducted === 0) return 0;
    return ((parseInt(attended) / parseInt(conducted)) * 100).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!enableTracking) {
      // Skip attendance setup
      onNext();
      return;
    }

    // Validate subjects
    const validSubjects = subjects.filter(
      (sub) => sub.subject && sub.conducted && sub.attended
    );

    if (validSubjects.length === 0) {
      setError('Please add at least one subject with all fields filled');
      return;
    }

    // Convert to numbers
    const formattedSubjects = validSubjects.map((sub) => ({
      subject: sub.subject,
      conducted: parseInt(sub.conducted),
      attended: parseInt(sub.attended),
    }));

    setLoading(true);
    setError('');

    try {
      await onboardingAPI.saveStep3({ subjects: formattedSubjects });
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        📊 Track your attendance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set up initial attendance data for your subjects
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={enableTracking}
              onChange={(e) => setEnableTracking(e.target.checked)}
            />
          }
          label="Do you want to set up attendance tracking?"
        />
      </Card>

      {enableTracking && (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            Enter your current attendance data. We'll help you track and maintain it going forward!
          </Alert>

          {subjects.map((subject, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Subject Name"
                    value={subject.subject}
                    onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Classes Conducted"
                    type="number"
                    value={subject.conducted}
                    onChange={(e) => handleSubjectChange(index, 'conducted', e.target.value)}
                    inputProps={{ min: 0 }}
                    required
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Classes Attended"
                    type="number"
                    value={subject.attended}
                    onChange={(e) => handleSubjectChange(index, 'attended', e.target.value)}
                    inputProps={{ min: 0 }}
                    required
                  />
                </Grid>
                <Grid item xs={8} md={3}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      textAlign: 'center',
                      bgcolor:
                        calculatePercentage(subject.attended, subject.conducted) >= 75
                          ? 'success.light'
                          : calculatePercentage(subject.attended, subject.conducted) >= 70
                          ? 'warning.light'
                          : 'error.light',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {calculatePercentage(subject.attended, subject.conducted)}%
                    </Typography>
                    <Typography variant="caption">Attendance</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} md={1}>
                  {subjects.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => removeSubject(index)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Card>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addNewSubject}
            sx={{ mb: 3 }}
          >
            Add Another Subject
          </Button>

          {/* Preview Table */}
          {subjects.some((s) => s.subject && s.conducted && s.attended) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Attendance Preview
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell align="center">Conducted</TableCell>
                      <TableCell align="center">Attended</TableCell>
                      <TableCell align="center">Percentage</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects
                      .filter((s) => s.subject && s.conducted && s.attended)
                      .map((subject, index) => {
                        const percentage = calculatePercentage(subject.attended, subject.conducted);
                        return (
                          <TableRow key={index}>
                            <TableCell>{subject.subject}</TableCell>
                            <TableCell align="center">{subject.conducted}</TableCell>
                            <TableCell align="center">{subject.attended}</TableCell>
                            <TableCell align="center">{percentage}%</TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  bgcolor:
                                    percentage >= 75
                                      ? 'success.main'
                                      : percentage >= 70
                                      ? 'warning.main'
                                      : 'error.main',
                                  color: 'white',
                                }}
                              >
                                {percentage >= 75 ? 'Safe' : percentage >= 70 ? 'Warning' : 'Critical'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>

        <Button
          variant="contained"
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{ px: 4 }}
        >
          {loading ? 'Saving...' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default AttendanceSetup;
