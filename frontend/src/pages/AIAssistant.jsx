import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  TextField,
  IconButton,
  Typography,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  AutoAwesome,
  Clear,
} from '@mui/icons-material';
import { chatAPI } from '../services/api';
import { slideUp, staggerContainer, staggerItem } from '../utils/animations';
import useAuthStore from '../store/authStore';

const AIAssistant = () => {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'What are my classes today?',
    'Check my attendance status',
    'When is my next exam?',
    'Show pending assignments',
    'Am I eligible for placements?',
    'Tell me about hostel rules',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(input);
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            AI Campus Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask me anything about your campus life
          </Typography>
        </Box>
        {messages.length > 0 && (
          <IconButton onClick={handleClearChat} color="error">
            <Clear />
          </IconButton>
        )}
      </Box>

      {/* Chat Container */}
      <Card
        sx={{
          height: 'calc(100vh - 280px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
        }}
      >
        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.length === 0 ? (
            <motion.div {...slideUp}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SmartToy sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Hello! How can I help you today?
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  I can help you with classes, attendance, assignments, placements, and more!
                </Typography>

                {/* Suggested Prompts */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, textAlign: 'center' }}>
                    Try asking:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Chip
                          label={prompt}
                          onClick={() => handlePromptClick(prompt)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                              color: 'white',
                            },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    {message.sender === 'ai' && (
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                          mr: 2,
                        }}
                      >
                        <SmartToy />
                      </Avatar>
                    )}
                    <Paper
                      elevation={0}
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 3,
                        background:
                          message.sender === 'user'
                            ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                            : 'rgba(99, 102, 241, 0.05)',
                        color: message.sender === 'user' ? 'white' : 'inherit',
                        border: message.sender === 'ai' ? '1px solid rgba(99, 102, 241, 0.1)' : 'none',
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          opacity: 0.7,
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Paper>
                    {message.sender === 'user' && (
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                          ml: 2,
                        }}
                      >
                        {user?.name?.charAt(0) || 'S'}
                      </Avatar>
                    )}
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  }}
                >
                  <SmartToy />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Thinking...</Typography>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            background: '#F8FAFC',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'white',
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || loading}
              sx={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                },
                '&:disabled': {
                  background: '#E5E7EB',
                  color: '#9CA3AF',
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default AIAssistant;
