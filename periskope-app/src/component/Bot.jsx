import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import './Bot.css';

const TelegramBot = ({ botName = "Periskope Assistant", botAvatar = "/api/placeholder/80/80" }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Periskope Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [showCommandButtons, setShowCommandButtons] = useState(true);
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
    if (inputText.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowCommandButtons(false);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/process-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const botResponse = {
          id: Date.now() + 1,
          text: data.message,
          sender: 'bot',
          timestamp: new Date(),
          type: data.type || 'info'
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.error || 'Failed to process message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCommandClick = async (command) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: command,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowCommandButtons(false);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send command to backend
      const response = await fetch('http://localhost:5000/api/process-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: command })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add bot response with markdown formatting
        const botResponse = {
          id: Date.now() + 1,
          text: data.message,
          sender: "bot",
          timestamp: new Date(),
          type: data.type || 'info'
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(data.error || 'Failed to process command');
      }
    } catch (error) {
      console.error('Error processing command:', error);
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

  const renderCommandButtons = () => {
    const buttons = [
      { command: '/features', label: 'Features', icon: '🚀' },
      { command: '/pricing', label: 'Pricing', icon: '💰' },
      { command: '/casestudies', label: 'Case Studies', icon: '📚' },
      { command: '/signup', label: 'Sign Up Free', icon: '✨', isCta: true },
      { command: '/demo', label: 'Book a Demo', icon: '📅', isCta: true }
    ];

    return (
      <div className="sticky-commands">
        <div className="command-buttons">
          {buttons.map((btn, i) => (
            <button 
              key={i} 
              className={`command-button ${btn.isCta ? 'cta-button' : ''}`}
              onClick={async () => {
                await handleCommandClick(btn.command);
              }}
            >
              <span className="button-content">
                <span className="button-icon">{btn.icon}</span>
                <span className="button-text">{btn.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const formatMessageText = (text, isFirstMessage = false) => {
    if (!text) return null;
    
    // Simple markdown parser for bold text
    const parseMarkdown = (text) => {
      return text.split('*').map((part, i) => 
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      );
    };
    
    return (
      <div className="message-text">
        {text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {parseMarkdown(line)}
            <br />
          </React.Fragment>
        ))}
        {isFirstMessage && renderCommandButtons(messages.length <= 2)}
      </div>
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
        {showCommandButtons && renderCommandButtons()}
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