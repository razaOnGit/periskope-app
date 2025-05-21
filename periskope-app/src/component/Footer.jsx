import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section logo-section">
        <img src="/logo.svg" alt="Periskope Logo" className="logo" />
        <p className="tagline">
          Supercharge your WhatsApp with a powerful CRM, workflow automation and integrations
        </p>
      </div>

      <div className="footer-section">
        <h4>Features</h4>
        <ul>
          <li>Shared Inbox for Multiple WhatsApp Numbers</li>
          <li>Shared WhatsApp Inbox for Multiple Agents</li>
          <li>Manage WhatsApp Groups</li>
          <li>Create Tasks and Tickets on WhatsApp</li>
          <li>Flag Important Messages on WhatsApp with AI</li>
          <li>Schedule Messages to WhatsApp Groups</li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Integrations</h4>
        <ul>
          <li>Integrate WhatsApp with HubSpot</li>
          <li>Integrate WhatsApp with Google Sheets</li>
          <li>Integrate WhatsApp with Zapier</li>
          <li>Integrate WhatsApp with CRM using Custom WhatsApp API & Webhooks</li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Company</h4>
        <ul>
          <li>Request a Demo</li>
          <li>Blog</li>
          <li>Pricing</li>
          <li>Security</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Cookies</li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Tools</h4>
        <ul>
          <li>Free WhatsApp Click To Chat Button</li>
          <li>Send WhatsApp Without Saving Number</li>
          <li>Personal WhatsApp Link Generator</li>
          <li>Check if number is on WhatsApp</li>
          <li>Get WhatsApp display name and picture</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
