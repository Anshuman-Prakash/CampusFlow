import Chat from '../models/Chat.model.js';
import { generateAIResponse } from '../services/gemini.service.js';

// @desc    Send message to AI
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Get or create chat history
    let chat = await Chat.findOne({ user: userId });
    if (!chat) {
      chat = await Chat.create({ user: userId, messages: [] });
    }

    // Add user message to history
    chat.messages.push({
      role: 'user',
      content: message,
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(message, req.user);

    // Add AI response to history
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      messages: chat?.messages || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
    });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
export const clearChatHistory = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { user: req.user.id },
      { messages: [] },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Chat history cleared',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
    });
  }
};
