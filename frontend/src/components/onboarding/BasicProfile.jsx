import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { onboardingAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const BasicProfile = ({ onNext }) => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    rollNumber: user?.rollNumber || '',
    email: user?.email || '',
    phone: '',
    gender: '',
    collegeName: '',
    degree: '',
    branch: user?.branch || '',
    semester: '',
    year: '',
    section: '',
    currentCGPA: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await onboardingAPI.saveStep1(formData);
      updateUser(response.data);
      onNext();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        👤 Tell us about yourself
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="e.g., John Doe"
              helperText="Enter your complete name as per official records"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              helperText="Email from your account (cannot be changed)"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Gender (Optional)"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="">Prefer not to say</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          {/* Academic Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Academic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="College/University Name"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
            >
              <MenuItem value="B.Tech">B.Tech</MenuItem>
              <MenuItem value="BCA">BCA</MenuItem>
              <MenuItem value="MCA">MCA</MenuItem>
              <MenuItem value="M.Tech">M.Tech</MenuItem>
              <MenuItem value="MBA">MBA</MenuItem>
              <MenuItem value="B.Sc">B.Sc</MenuItem>
              <MenuItem value="M.Sc">M.Sc</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Branch/Department"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5].map((yr) => (
                <MenuItem key={yr} value={yr}>
                  Year {yr}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="A, B, C, etc."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Current CGPA"
              name="currentCGPA"
              type="number"
              value={formData.currentCGPA}
              onChange={handleChange}
              inputProps={{ min: 0, max: 10, step: 0.01 }}
              placeholder="8.5"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
            disabled={loading}
            sx={{ px: 4 }}
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default BasicProfile;
