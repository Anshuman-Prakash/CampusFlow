import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar, IconButton, CircularProgress, Alert } from '@mui/material';
import { Event, Bookmark, BookmarkBorder, CheckCircle, CalendarToday, LocationOn } from '@mui/icons-material';
import { staggerContainer, staggerItem } from '../utils/animations';
import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventAPI.register(eventId);
      // Update local state
      setEvents(events.map(e => 
        e._id === eventId ? { ...e, registered: true } : e
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleBookmark = async (eventId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await eventAPI.unbookmark(eventId);
      } else {
        await eventAPI.bookmark(eventId);
      }
      // Update local state
      setEvents(events.map(e => 
        e._id === eventId ? { ...e, bookmarked: !isBookmarked } : e
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update bookmark');
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

  if (events.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No upcoming events. Check back later!
      </Alert>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Event Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse, register, and bookmark campus events
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {events.map((event, index) => (
          <Grid item xs={12} md={6} key={event._id}>
            <motion.div variants={staggerItem} whileHover={{ y: -5 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={event.type}
                      size="small"
                      color="primary"
                    />
                    <IconButton size="small" onClick={() => handleBookmark(event._id, event.bookmarked)}>
                      {event.bookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {event.title}
                  </Typography>

                  {event.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.venue}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {event.organizer.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Organized by {event.organizer}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant={event.registered ? 'outlined' : 'contained'}
                    startIcon={event.registered ? <CheckCircle /> : <Event />}
                    disabled={event.registered}
                    onClick={() => handleRegister(event._id)}
                  >
                    {event.registered ? 'Registered' : 'Register Now'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default EventManagement;
