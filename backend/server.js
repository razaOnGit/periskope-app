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

// CORS configuration
const corsOptions = {
  origin: [
    'https://periskope-clone-hazel.vercel.app', // Your Vercel frontend URL
    'http://localhost:3000',             // Local development
    'https://periskope-app-backend.onrender.com' // Your backend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Service is healthy'
  });
});

// Simple ping endpoint for internal monitoring
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Initialize Telegram Bot without polling
const bot = new TelegramBot(BOT_TOKEN);

// Store chat IDs and user states
const chatIds = new Set();
const userStates = new Map();

// Webhook setup
const setupWebhook = async () => {
    try {
        console.log('Starting webhook setup...');
        
        // Check current webhook info first
        const currentWebhook = await bot.getWebHookInfo();
        console.log('Current webhook info:', currentWebhook);
        
        // Remove any existing webhook
        console.log('Removing existing webhook...');
        await bot.deleteWebHook();
        
        // Set up the new webhook
        const webhookUrl = `${DOMAIN}/bot${BOT_TOKEN}`;
        console.log(`Setting up new webhook to: ${webhookUrl}`);
        
        // Set webhook with max connections and allowed updates
        const webhookResult = await bot.setWebHook(webhookUrl, {
            max_connections: 40,
            allowed_updates: ['message', 'callback_query']
        });
        
        console.log('Webhook setup result:', webhookResult);
        
        // Verify webhook was set
        const webhookInfo = await bot.getWebHookInfo();
        console.log('Updated webhook info:', {
            url: webhookInfo.url,
            has_custom_certificate: webhookInfo.has_custom_certificate,
            pending_update_count: webhookInfo.pending_update_count,
            last_error_date: webhookInfo.last_error_date,
            last_error_message: webhookInfo.last_error_message,
            max_connections: webhookInfo.max_connections,
            allowed_updates: webhookInfo.allowed_updates
        });
        
        return true;
    } catch (error) {
        console.error('Error in webhook setup:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        throw error; // Re-throw to be handled by the caller
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
// Start the server
const startServer = async () => {
  // Log server start
  console.log('🚀 Starting Periskope server...');
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔄 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🔄 Ping endpoint available at: http://localhost:${PORT}/ping`);

  try {
    // Check for required environment variables
    if (!BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
    }

    // Log environment info
    console.log('Starting server with configuration:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT,
      DOMAIN: DOMAIN || 'Not set, using default',
      BOT_TOKEN: BOT_TOKEN ? '***' + BOT_TOKEN.slice(-4) : 'Not set'
    });

    // For production, ensure DOMAIN is set
    if (process.env.NODE_ENV === 'production' && !DOMAIN) {
      throw new Error('DOMAIN environment variable must be set in production');
    }
    
    // Start the HTTP server
    const server = app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      
      // Set up webhook in production
      if (process.env.NODE_ENV === 'production') {
        try {
          console.log('Setting up webhook for production...');
          await setupWebhook();
          console.log('Webhook setup completed successfully');
        } catch (error) {
          console.error('Failed to set up webhook:', error);
          // Don't exit in production to allow for debugging
          console.log('Continuing without webhook setup...');
        }
      } else {
        console.log('Running in development mode. Webhook setup skipped.');
        console.log('To test with webhooks locally, use ngrok: https://ngrok.com/');
        console.log(`Then set DOMAIN to your ngrok URL and restart the server`);
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Server has been stopped');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
if (require.main === module) {
  startServer().catch(error => {
    console.error('Unhandled error in server startup:', error);
    process.exit(1);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});