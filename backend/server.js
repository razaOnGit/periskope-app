// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const { processMessage } = require('./tele');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

// Store chat IDs and user states
const chatIds = new Set();
const userStates = new Map(); // In-memory store for user states

// Listen for any kind of message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = `telegram_${chatId}`; // Prefix to avoid conflicts
  chatIds.add(chatId); // Store chat ID for future messages
  
  // Get or initialize user state
  const state = userStates.get(userId) || {};
  
  // Process the message and send response
  try {
    const response = processMessage(msg.text || '', state);
    
    // Update state if needed
    if (response.state) {
      userStates.set(userId, response.state);
    }
    
    bot.sendMessage(chatId, response.message, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    bot.sendMessage(chatId, "I'm sorry, I encountered an error processing your message. Please try again.");
  }
});

// API endpoint to process messages from frontend
app.post('/api/process-message', async (req, res) => {
  const { message, userId = 'web_guest' } = req.body; // Default to 'web_guest' if no userId provided
  
  if (!message) {
    return res.status(400).json({ 
      success: false,
      error: 'Message is required' 
    });
  }

  try {
    // Get or initialize user state
    const state = userStates.get(userId) || {};
    
    // Process the message and get response
    const response = processMessage(message, state);
    
    // Update state if needed
    if (response.state) {
      userStates.set(userId, response.state);
    }
    
    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});