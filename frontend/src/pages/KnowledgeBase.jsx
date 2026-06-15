import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { School, Upload, Search, Description } from '@mui/icons-material';
import { staggerContainer, staggerItem } from '../utils/animations';
import { useState } from 'react';

const KnowledgeBase = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const documents = [
    { id: 1, title: 'Academic Handbook 2026', category: 'Academic', pages: 156 },
    { id: 2, title: 'Hostel Rules & Regulations', category: 'Hostel', pages: 24 },
    { id: 3, title: 'Placement Policy', category: 'Placement', pages: 45 },
  ];

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 2000);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Campus Knowledge Base
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload documents and query them with AI-powered RAG
          </Typography>
        </Box>
      </motion.div>

      {/* Search Section */}
      <motion.div variants={staggerItem}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Ask a Question
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="e.g., What is the attendance policy?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={searching}
              />
              <Button
                variant="contained"
                startIcon={searching ? <CircularProgress size={20} /> : <Search />}
                onClick={handleSearch}
                disabled={searching}
                sx={{ minWidth: 120 }}
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Section */}
      <motion.div variants={staggerItem}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Upload Document
            </Typography>
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed rgba(99, 102, 241, 0.3)',
                background: 'rgba(99, 102, 241, 0.02)',
              }}
            >
              <Upload sx={{ fontSize: 48, color: '#6366F1', mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 2 }}>
                Drop PDF documents here or click to browse
              </Typography>
              <Button variant="outlined">Choose File</Button>
            </Paper>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents List */}
      <motion.div variants={staggerItem}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Uploaded Documents
        </Typography>
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} md={4} key={doc.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Description sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {doc.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.pages} pages • {doc.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" size="small" fullWidth>
                    Query Document
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </motion.div>
  );
};

export default KnowledgeBase;
