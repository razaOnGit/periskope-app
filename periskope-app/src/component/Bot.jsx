import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, Image, MessageSquare } from 'lucide-react';
import './Bot.css';

const TelegramBot = ({ botName = "Periskope Assistant", botAvatar = "/api/placeholder/80/80" }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hello! Welcome to Periskope. How can I help you manage your WhatsApp communications today?", sender: "bot", timestamp: new Date() }
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

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setInputText("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Bot response logic customized for Periskope
  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hi there! I'm the Periskope Assistant. How can I help you with your WhatsApp business needs today?";
    } else if (lowerInput.includes("help")) {
      return "I can assist with info about WhatsApp management, scale communications, or integration with your systems. What would you like to know?";
    } else if (lowerInput.includes("whatsapp") || lowerInput.includes("number")) {
      return "Periskope allows you to connect multiple WhatsApp numbers without requiring the WhatsApp Business API. Would you like to know more about this feature?";
    } else if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("pricing")) {
      return "Periskope offers flexible pricing plans to suit businesses of all sizes. You can sign up for free and explore our platform. Would you like me to explain our pricing tiers?";
    } else if (lowerInput.includes("api") || lowerInput.includes("business api")) {
      return "One of the key advantages of Periskope is that you don't need the WhatsApp Business API to get started. You can connect any WhatsApp number and start managing your communications right away.";
    } else if (lowerInput.includes("feature") || lowerInput.includes("features")) {
      return "Periskope offers features like multi-number connection, task & ticket creation, system integration, and workflow automation for WhatsApp. Which feature would you like to explore further?";
    } else if (lowerInput.includes("thanks") || lowerInput.includes("thank you")) {
      return "You're welcome! Feel free to sign up for free or book a demo if you'd like to see Periskope in action.";
    } else if (lowerInput.includes("demo")) {
      return "You can book a personalized demo with our team by clicking the 'Book a Demo' button on our homepage. Would you like me to point you to that?";
    } else if (lowerInput.includes("sign up") || lowerInput.includes("signup") || lowerInput.includes("register")) {
      return "Great! You can sign up for free by clicking the 'Sign Up for Free' button on our homepage. No credit card required to get started.";
    } else {
      return "Thanks for your message. Periskope helps businesses manage WhatsApp communications at scale. Could you tell me what specific aspect of our platform you're interested in?";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="telegram-bot">
      <div className="bot-header">
        <img src={botAvatar} alt={botName} className="bot-avatar" />
        <div className="bot-info">
          <h3 className="bot-name">{botName}</h3>
          <span className="bot-status">Online</span>
        </div>
        <div className="bot-actions">
          <button className="action-button">
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === "bot" ? "bot-message" : "user-message"}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-area">
        <div className="attachment-button">
          <Paperclip size={20} />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about Periskope..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <div className="input-actions">
          <button className="action-button">
            <Smile size={20} />
          </button>
          <button className="action-button">
            <Mic size={20} />
          </button>
          {inputText ? (
            <button className="send-button" onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          ) : (
            <button className="action-button">
              <Image size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramBot;