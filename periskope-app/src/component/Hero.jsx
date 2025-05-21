import React from 'react';
import './Hero.css';


const Hero = () => {
  return (
    <div className="whatsapp-content">
      <div className="left-column">
        
        <div className="text-content">
          <h2>
            The only platform you need to <span className="highlight">automate your day to day business</span> on WhatsApp
          </h2>
        </div>
        
        <div className="info-block">
          <h4>MULTI-NUMBER INBOX</h4>
          <h3>Gain complete visibility and control over your team's WhatsApp conversations</h3>
          <ul>
            <li><span>✔</span> <strong>Multi-number inbox:</strong> connect multiple numbers to one shared inbox. Works with any WhatsApp number.</li>
            <li><span>✔</span> <strong>Team access:</strong> enable your entire team to view and respond to messages without direct WhatsApp access.</li>
            <li><span>✔</span> <strong>Track metrics:</strong> monitor key metrics like # response rates and times, unanswered questions, and more.</li>
            <li><span>✔</span> <strong>Works with any number:</strong> does not require WhatsApp Business API. Works with any WhatsApp number.</li>
          </ul>
          <button className="demo-button">Book a Demo</button>
        </div>
      </div>
      
      <div className="image-content">
        <img src="/whatsapp.avif" alt="WhatsApp Demo" />
      </div>
    </div>
   
  );
};

export default Hero;
