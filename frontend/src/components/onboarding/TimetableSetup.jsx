import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowForward, ArrowBack, Add, Delete, Upload } from '@mui/icons-material';
import { timetableAPI } from '../../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableSetup = ({ onNext, onBack }) => {
  const [mode, setMode] = useState('manual'); // 'upload' or 'manual'
  const [classes, setClasses] = useState([
    { subject: '', day: 'Monday', startTime: '', endTime: '', roomNumber: '', facultyName: '' },
  ]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setError('');
    }
  };

  const handleClassChange = (index, field, value) => {
    const updatedClasses = [...classes];
    updatedClasses[index][field] = value;
    setClasses(updatedClasses);
  };

  const addNewClass = () => {
    setClasses([
      ...classes,
      { subject: '', day: 'Monday', startTime: '', endTime: '', roomNumber: '', facultyName: '' },
    ]);
  };

  const removeClass = (index) => {
    if (classes.length > 1) {
      const updatedClasses = classes.filter((_, i) => i !== index);
      setClasses(updatedClasses);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType === 'application/pdf' ||
        fileType.startsWith('image/')
      ) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or image file');
        setFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('timetable', file);

      const response = await timetableAPI.uploadTimetable(formData);
      // Successfully uploaded and AI extracted data
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    // Validate at least one class
    const validClasses = classes.filter(
      (cls) => cls.subject && cls.day && cls.startTime && cls.endTime
    );

    if (validClasses.length === 0) {
      setError('Please add at least one class with all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await timetableAPI.saveManualTimetable({ classes: validClasses });
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip timetable setup and move to next step
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        📅 Set up your class timetable
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload your timetable or enter classes manually
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Mode Toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          fullWidth
        >
          <ToggleButton value="manual">
            Manual Entry
          </ToggleButton>
          <ToggleButton value="upload">
            Upload File (AI Extract)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Upload Mode */}
      {mode === 'upload' && (
        <Box>
          <Card variant="outlined" sx={{ mb: 3, p: 3, textAlign: 'center' }}>
            <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload your timetable
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: PDF, JPG, PNG, Screenshot
            </Typography>
            <input
              accept="application/pdf,image/*"
              style={{ display: 'none' }}
              id="timetable-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="timetable-file">
              <Button variant="outlined" component="span" sx={{ mb: 1 }}>
                Choose File
              </Button>
            </label>
            {file && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Card>

          <Alert severity="info" sx={{ mb: 3 }}>
            Our AI will automatically extract class details from your timetable!
          </Alert>
        </Box>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && (
        <Box>
          {classes.map((classItem, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Subject Name"
                    value={classItem.subject}
                    onChange={(e) => handleClassChange(index, 'subject', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Day"
                    value={classItem.day}
                    onChange={(e) => handleClassChange(index, 'day', e.target.value)}
                    required
                  >
                    {DAYS.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={classItem.startTime}
                    onChange={(e) => handleClassChange(index, 'startTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={classItem.endTime}
                    onChange={(e) => handleClassChange(index, 'endTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Room (Optional)"
                    value={classItem.roomNumber}
                    onChange={(e) => handleClassChange(index, 'roomNumber', e.target.value)}
                    placeholder="101"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Faculty (Optional)"
                    value={classItem.facultyName}
                    onChange={(e) => handleClassChange(index, 'facultyName', e.target.value)}
                    placeholder="Dr. Smith"
                  />
                </Grid>
                {classes.length > 1 && (
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      color="error"
                      onClick={() => removeClass(index)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Card>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addNewClass}
            sx={{ mb: 3 }}
          >
            Add Another Class
          </Button>
        </Box>
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="text"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
          </Button>

          <Button
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
            onClick={mode === 'upload' ? handleFileUpload : handleManualSubmit}
            disabled={loading}
            sx={{ px: 4 }}
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TimetableSetup;
