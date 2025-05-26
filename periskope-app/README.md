# Periskope App

Periskope is a platform to manage WhatsApp groups and chats at scale. It enables you to connect multiple WhatsApp numbers, create tasks and tickets, integrate with your systems, and automate workflows on WhatsApp without requiring the WhatsApp Business API.

## Features

- Manage WhatsApp groups and chats efficiently
- Connect multiple WhatsApp numbers
- Create tasks and tickets for better workflow management
- Integrate with external systems and services
- Automate workflows on WhatsApp
- Chat support via WhatsApp and Telegram bot integration
- Responsive and user-friendly web interface

## Backend

The backend is a Node.js Express server that integrates with a Telegram bot to process messages and send responses.

### Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your Telegram bot token:

   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ```

### Running the Backend

- To start the server //backend folder ---- cd backend:

  ```bash
  npm start
  ```

- For development with automatic restarts on changes:

  ```bash
  npm run dev     //backend cd backend
  ```

The backend server runs on port 5000 by default.

### API Endpoints

- `POST /api/process-message`  
  Process a message sent from the frontend and get a response.

- `POST /api/send-message`  
  Send a message to all stored Telegram chat IDs.

## Frontend

The frontend is a React application created with Create React App. It provides a user interface to interact with the backend and manage WhatsApp communications.

### Setup

1. Navigate to the `periskope-app` directory:

   ```bash
   cd periskope-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Frontend

- To start the development server://frontend folder ---- cd periskope-app

  ```bash
  npm start
  ```

The frontend runs on port 3000 by default and opens in your browser at [http://localhost:3000](http://localhost:3000).

## Useful Links

- [Documentation](https://docs.periskope.app/get-started/introduction)
- [Pricing](https://periskope.app/pricing)
- [Login](https://console.periskope.app/login)
- [Book a Demo](https://cal.com/team/periskope/demo)
- [WhatsApp Chat Support](https://wa.me/+919289665999)

## License

This project is licensed under the terms specified by the Periskope team.

---

Powered by Periskope — managing WhatsApp communications at scale.
