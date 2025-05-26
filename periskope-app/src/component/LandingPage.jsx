import React, { useState } from 'react';
import './style.css';
import Footer from './Footer';
import Hero from './Hero';
import HeroSection from './HeroBot';

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(prevState => !prevState);
  };

  const closeNav = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.nav-items');
      const toggle = document.querySelector('.mobile-toggle');
      
      if (isOpen && nav && toggle && 
          !nav.contains(event.target) && 
          !toggle.contains(event.target)) {
        closeNav();
      }
    };

    // Disable scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Navbar container */}
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" />
        </div>
        
        {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle" 
        onClick={toggleNav}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Navigation Items */}
      <div className={`nav-items ${isOpen ? 'active' : ''}`}>
        <a href="https://docs.periskope.app/features/multi-number-inbox" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Features</a>
        <a href="https://docs.periskope.app/integrations" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Integrations</a>
        <a href="https://docs.periskope.app/case-studies" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Case Studies</a>
        <a href="https://docs.periskope.app/resources" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Resources</a>
        <a href="https://docs.periskope.app/get-started/introduction" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Affiliates</a>
        <a href="https://periskope.app/pricing" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Pricing</a>
        <a href="https://console.periskope.app/login" className="login-btn" target="_blank" rel="noopener noreferrer" onClick={closeNav}>Login</a>
      </div>
      </nav>

      <div className="whatsapp-container">
        <a href="https://wa.me/+919289665999" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div className="whatsapp-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" width="24" height="24">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
            </svg>
            <span>Chat on WhatsApp</span>
          </div>
        </a>
      </div>

      {/* Sticky Telegram HeroSection */}
      {/* <div className="telegram-sticky"> */}
        <HeroSection />
      {/* </div> */}

      <section>
        <div className="hero-section">
          <div className="badge">Periskope Launch Week 8 Is Here ! &gt;</div>

          <h1 className="headline">
            Manage <span className="green-text">WhatsApp Groups</span><br />
            and <span className="green-text">Chats</span> at scale
          </h1>

          <p className="description">
            Connect multiple numbers, create tasks & tickets, integrate with your<br />
            systems, and automate your workflows on WhatsApp
          </p>

          <div className="buttons">
            <a href="https://console.periskope.app/login" className="btn green">Sign Up for Free </a>
            <a href=' https://cal.com/team/periskope/demo' className="btn white">Book a Demo</a>
          </div>

          <p className="footer-note">
            Connect any WhatsApp Number. No WhatsApp Business API Required.
          </p>

          <div className="trusted-section">
            <h3>Powering 5000+ businesses across 50+ countries</h3>
            <div className="logo-container">
              <img src="/plum.avif" alt="Plum" />
              <img src="/treebo.avif" alt="Treebo" />
              <img src="/zostel.avif" alt="Zostel" />
              <img src="/vividseats.avif" alt="Vividseats" />
              <img src="/greatlearning.avif" alt="Great Learning" />
              <img src="/ninjacart.avif" alt="Ninjacart" />
              <img src="/flyfat.avif" alt="FlyFlat" />
              <img src="/magic.avif" alt="Magicbricks" />
              <img src="/kredivo.avif" alt="Kredivo" />
              <img src="/toronto.avif" alt="University of Toronto" />
            </div>
          </div>
        </div>
      </section>
      <Hero />
      <Footer /> 
    </>
  );
};

export default LandingPage;
