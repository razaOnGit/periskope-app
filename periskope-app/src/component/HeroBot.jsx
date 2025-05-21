// HeroBot.jsx - Updated implementation of Telegram bot for your landing page
import React, { useState } from 'react';
import TelegramBot from './Bot';
import './HeroBot.css';

const HeroSection = () => {
  const [isBotOpen, setIsBotOpen] = useState(false);

  const toggleBot = () => {
    setIsBotOpen(!isBotOpen);
  };

  return (
    <div className={`telegram-container ${isBotOpen ? 'open' : 'closed'}`}>
      {/* Bot toggle button */}
      <div className="telegram-bot-toggle" onClick={toggleBot}>
        {!isBotOpen ? (
          <div className="bot-icon">
           
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"white"} >
    <path d="M19 16V14C19 11.1716 19 9.75736 18.1213 8.87868C17.2426 8 15.8284 8 13 8H11C8.17157 8 6.75736 8 5.87868 8.87868C5 9.75736 5 11.1716 5 14V16C5 18.8284 5 20.2426 5.87868 21.1213C6.75736 22 8.17157 22 11 22H13C15.8284 22 17.2426 22 18.1213 21.1213C19 20.2426 19 18.8284 19 16Z" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round"></path>
    <path d="M19 18C20.4142 18 21.1213 18 21.5607 17.5607C22 17.1213 22 16.4142 22 15C22 13.5858 22 12.8787 21.5607 12.4393C21.1213 12 20.4142 12 19 12" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round"></path>
    <path d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15C2 13.5858 2 12.8787 2.43934 12.4393C2.87868 12 3.58579 12 5 12" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round"></path>
    <path d="M13.5 3.5C13.5 4.32843 12.8284 5 12 5C11.1716 5 10.5 4.32843 10.5 3.5C10.5 2.67157 11.1716 2 12 2C12.8284 2 13.5 2.67157 13.5 3.5Z" stroke="#000000" strokeWidth="1.5"></path>
    <path d="M12 5V8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M9 13V14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M15 13V14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M10 17.5C10 17.5 10.6667 18 12 18C13.3333 18 14 17.5 14 17.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
  
            </svg>
            {!isBotOpen && <span className="bot-label">Guide you</span>}
          </div>
        ) : (
          <div className="close-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Bot container - only shown when open */}
      <div className={`bot-container ${isBotOpen ? 'visible' : ''}`}>
        <TelegramBot 
          botName="Periskope Assistant" 
          botAvatar="/api/placeholder/80/80" 
        />
      </div>
    </div>
  );
};

export default HeroSection;