import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import './Bot.css';

const TelegramBot = ({ botName = "Periskope Assistant", botAvatar = "/api/placeholder/80/80" }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to Periskope. How can I help you manage your WhatsApp communications today?", sender: "bot", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to our backend for processing
      const response = await fetch('http://localhost:5000/api/process-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add bot response with formatted message
        const botResponse = {
          id: Date.now() + 1,
          text: data.message,
          sender: "bot",
          timestamp: new Date(),
          type: data.type || 'info' // Add message type for styling
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.error || 'Failed to process message');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: "bot",
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCommandClick = (command) => {
    setInputText(command);
    // Auto-send the command
    const sendButton = document.querySelector('.send-button');
    if (sendButton) {
      sendButton.click();
    }
  };

  const renderCommandButtons = () => {
    const commands = [
      { command: '/features', label: 'See our features' },
      { command: '/pricing', label: 'View pricing plans' },
      { command: '/casestudies', label: 'Read success stories' },
      { command: '/help', label: 'Show this help message' }
    ];

    return (
      <div className="command-buttons">
        {commands.map((cmd, i) => (
          <button 
            key={i} 
            className="command-button"
            onClick={() => handleCommandClick(cmd.command)}
          >
            <span className="command">{cmd.command}</span>
            <span className="command-description">{cmd.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const formatMessageText = (text, isFirstMessage = false) => {
    if (!text) return null;
    return (
      <>
        {text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
        {isFirstMessage && messages.length === 1 && renderCommandButtons()}
      </>
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={botAvatar} alt={botName} className="bot-avatar" />
        <div className="header-info">
          <h3>{botName}</h3>
          <span>{isTyping ? 'typing...' : 'online'}</span>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === 'bot' ? 'bot-message' : 'user-message'
            }`}
          >
            <div className={`message-content ${message.type ? `message-${message.type}` : ''}`}>
              {formatMessageText(message.text, message.id === 1)}
              <div className="message-time">
                {formatTime(new Date(message.timestamp))}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="send-button" 
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );


};

export default TelegramBot;