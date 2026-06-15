import express from 'express';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/message', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/history', protect, clearChatHistory);

export default router;
