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

// Store chat IDs for broadcasting
const chatIds = new Set();

// Listen for any kind of message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  chatIds.add(chatId); // Store chat ID for future messages
  
  // Process the message and send response
  try {
    const response = processMessage(msg.text || '');
    bot.sendMessage(chatId, response.message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    bot.sendMessage(chatId, "I'm sorry, I encountered an error processing your message. Please try again.");
  }
});

// API endpoint to process messages from frontend
app.post('/api/process-message', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ 
      success: false,
      error: 'Message is required' 
    });
  }

  try {
    // Process the message and get response
    const response = processMessage(message);
    
    res.json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message',
      message: "I'm sorry, I encountered an error. Please try again."
    });
  }
});

// API endpoint to send message from frontend
app.post('/api/send-message', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Send message to all stored chat IDs
  const sendPromises = Array.from(chatIds).map(chatId => 
    bot.sendMessage(chatId, message)
      .catch(error => {
        console.error(`Error sending message to ${chatId}:`, error);
        return { success: false, chatId, error: error.message };
      })
  );

  Promise.all(sendPromises)
    .then(results => {
      const successCount = results.filter(r => r && r.message_id).length;
      res.json({
        success: true,
        message: `Message sent to ${successCount} chat(s)`
      });
    })
    .catch(error => {
      console.error('Error sending messages:', error);
      res.status(500).json({ error: 'Failed to send messages' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Bot is running...`);
});
