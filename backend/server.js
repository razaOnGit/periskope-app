// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const { processMessage } = require('./tele');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DOMAIN = process.env.DOMAIN || 'https://yourdomain.com';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Telegram Bot without polling
const bot = new TelegramBot(BOT_TOKEN);

// Store chat IDs and user states
const chatIds = new Set();
const userStates = new Map();

// Webhook setup
const setupWebhook = async () => {
    try {
        // Remove any existing webhook
        await bot.deleteWebHook();
        
        // Set up the webhook
        const webhookUrl = `${DOMAIN}/bot${BOT_TOKEN}`;
        console.log(`Setting webhook to: ${webhookUrl}`);
        
        const webhookResult = await bot.setWebHook(webhookUrl);
        console.log('Webhook setup result:', webhookResult);
        
        // Verify webhook was set
        const webhookInfo = await bot.getWebHookInfo();
        console.log('Webhook info:', webhookInfo);
        
    } catch (error) {
        console.error('Error setting up webhook:', error);
        process.exit(1);
    }
};

// The callback that Telegram will call when a message is received
app.post(`/bot${BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Listen for any kind of message
bot.on('message', (msg) => {
  console.log('Received message:', msg);
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
    bot.sendMessage(chatId, "I'm sorry, I encountered an error processing your message. Please try again.")
      .catch(err => console.error('Error sending error message:', err));
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
const startServer = async () => {
  try {
    // If you have SSL certificates for HTTPS, use them
    // const options = {
    //   key: fs.readFileSync('path/to/privkey.pem'),
    //   cert: fs.readFileSync('path/to/cert.pem')
    // };
    // const server = https.createServer(options, app);
    // server.listen(PORT, async () => {
    //   console.log(`HTTPS Server running on port ${PORT}`);
    //   await setupWebhook();
    // });
    
    // For development with HTTP
    app.listen(PORT, async () => {
      console.log(`HTTP Server running on port ${PORT}`);
      if (process.env.NODE_ENV === 'production') {
        await setupWebhook();
      } else {
        console.log('Running in development mode. Webhook setup skipped.');
        console.log('To test locally, use ngrok: https://ngrok.com/');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});