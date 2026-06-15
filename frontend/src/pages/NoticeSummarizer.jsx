import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  CalendarToday,
  LocationOn,
  CheckCircle,
  Delete,
} from '@mui/icons-material';
import { noticeAPI } from '../services/api';
import { staggerContainer, staggerItem } from '../utils/animations';

const NoticeSummarizer = () => {
  const [file, setFile] = useState(null);
  const [notices, setNotices] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('notice', file);

    try {
      const response = await noticeAPI.uploadNotice(formData);
      setNotices([response.data, ...notices]);
      setFile(null);
    } catch (err) {
      setError('Failed to upload and process notice');
    } finally {
      setUploading(false);
    }
  };

  const mockNotices = [
    {
      id: 1,
      title: 'Mid-Term Examination Schedule',
      summary: 'Mid-term examinations for all B.Tech students will be conducted from June 20-25, 2026. Students must carry their ID cards and admit cards to the examination hall.',
      deadlines: ['Registration: June 18, 2026', 'Exam Start: June 20, 2026'],
      venue: 'Examination Halls A, B, C',
      actionItems: ['Download Admit Card', 'Check Examination Schedule', 'Carry ID Card'],
      uploadedAt: '2026-06-10',
    },
    {
      id: 2,
      title: 'Tech Fest 2026 - Call for Participants',
      summary: 'Annual Tech Fest will be organized on July 5-7, 2026. Students can register for various technical events, coding competitions, and workshops.',
      deadlines: ['Registration Deadline: June 25, 2026', 'Event Date: July 5-7, 2026'],
      venue: 'Main Auditorium & Computer Labs',
      actionItems: ['Register Online', 'Form Teams (2-4 members)', 'Pay Registration Fee'],
      uploadedAt: '2026-06-12',
    },
  ];

  const displayNotices = notices.length > 0 ? notices : mockNotices;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Notice Summarizer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload PDF notices and get AI-powered summaries with extracted deadlines
          </Typography>
        </Box>
      </motion.div>

      {/* Upload Section */}
      <motion.div variants={staggerItem}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                border: '2px dashed rgba(99, 102, 241, 0.3)',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                background: 'rgba(99, 102, 241, 0.02)',
              }}
            >
              <CloudUpload sx={{ fontSize: 60, color: '#6366F1', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Upload Notice PDF
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Drag and drop or click to browse
              </Typography>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="upload-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-file">
                <Button variant="contained" component="span">
                  Choose File
                </Button>
              </label>
              {file && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={file.name}
                    onDelete={() => setFile(null)}
                    color="primary"
                    icon={<Description />}
                  />
                  <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={uploading}
                    sx={{ ml: 2 }}
                  >
                    {uploading ? 'Processing...' : 'Upload & Analyze'}
                  </Button>
                </Box>
              )}
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notices List */}
      <Grid container spacing={3}>
        {displayNotices.map((notice, index) => (
          <Grid item xs={12} key={notice.id}>
            <motion.div
              variants={staggerItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {notice.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded: {new Date(notice.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  {/* Summary */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      mb: 3,
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                      {notice.summary}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {/* Deadlines */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(239, 68, 68, 0.05)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarToday sx={{ fontSize: 20, color: '#EF4444' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Important Dates
                          </Typography>
                        </Box>
                        {notice.deadlines.map((deadline, idx) => (
                          <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                            • {deadline}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>

                    {/* Venue */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(6, 182, 212, 0.05)',
                          border: '1px solid rgba(6, 182, 212, 0.2)',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationOn sx={{ fontSize: 20, color: '#06B6D4' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Venue
                          </Typography>
                        </Box>
                        <Typography variant="body2">{notice.venue}</Typography>
                      </Box>
                    </Grid>

                    {/* Action Items */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CheckCircle sx={{ fontSize: 20, color: '#10B981' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Action Items
                          </Typography>
                        </Box>
                        {notice.actionItems.map((item, idx) => (
                          <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                            • {item}
                          </Typography>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Add to Calendar Button */}
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="contained" size="small" startIcon={<CalendarToday />}>
                      Add to Calendar
                    </Button>
                    <Button variant="outlined" size="small">
                      View Original PDF
                    </Button>
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

export default NoticeSummarizer;
