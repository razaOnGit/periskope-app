// Process incoming messages and return response
const processMessage = (text) => {
  const lowerText = text ? text.trim().toLowerCase() : '';
  
  // Handle commands and natural language
  if (lowerText === 'pricing' || lowerText === '/pricing') {
    return {
      type: 'pricing',
      message: "💰 *Pricing Plans* 💰\n\n*Starter Plan* - $29/month\n- 3 WhatsApp numbers\n- 5 team members\n- Basic automation\n\n*Business Plan* - $99/month\n- 10 WhatsApp numbers\n- 15 team members\n- Advanced features\n\n*Enterprise Plan* - Custom pricing\n- Unlimited numbers\n- Unlimited team members\n- Custom automation"
    };
  } else if (lowerText === 'features' || lowerText === '/features') {
    return {
      type: 'features',
      message: "🚀 *Features* 🚀\n\n1. *Multi-Number Inbox*\n   - Connect and manage multiple WhatsApp numbers from one platform\n\n2. *Create Tickets & Tasks*\n   - Convert WhatsApp queries into tickets\n\n3. *Scheduled Messaging*\n   - Schedule messages to groups & 1:1 chats\n\n4. *Shared Inbox for Teams*\n   - Collaborate with your team on WhatsApp\n\n5. *Automate Actions*\n   - Automate common tasks and workflows\n\n6. *System Integration*\n   - Connect with your existing tools and CRM"
    };
  } else if (lowerText === 'case studies' || lowerText === 'casestudies' || lowerText === '/casestudies') {
    return {
      type: 'caseStudies',
      message: "📚 *Success Stories* 📚\n\n1. *E-commerce Business*\n   - 40% increase in satisfaction\n   - 3x faster response time\n\n2. *Real Estate Agency*\n   - 60% more leads captured\n   - 24/7 customer support\n\n3. *Healthcare Provider*\n   - 50% reduction in no-shows"
    };
  } else if (lowerText.startsWith('/start') || lowerText.startsWith('/help') || 
      lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
    return {
      type: 'greeting',
      message: "Hi there! I'm the Periskope Assistant. How can I help you with your WhatsApp business needs today?"
    };
  } else if (lowerText.startsWith('/features') || lowerText.includes('feature')) {
    return {
      type: 'features',
      message: "🚀 *Features* 🚀\n\n1. *Multi-Number Inbox*\n   - Connect and manage multiple WhatsApp numbers from one platform\n\n2. *Create Tickets & Tasks*\n   - Convert WhatsApp queries into tickets\n\n3. *Scheduled Messaging*\n   - Schedule messages to groups & 1:1 chats\n\n4. *Shared Inbox for Teams*\n   - Collaborate with your team on WhatsApp\n\n5. *Automate Actions*\n   - Automate common tasks and workflows\n\n6. *System Integration*\n   - Connect with your existing tools and CRM"
    };
  } else if (lowerText.startsWith('/pricing') || lowerText.includes('price') || lowerText.includes('cost')) {
    return {
      type: 'pricing',
      message: "💰 *Pricing Plans* 💰\n\n*Starter Plan* - $29/month\n- 3 WhatsApp numbers\n- 5 team members\n- Basic automation\n\n*Business Plan* - $99/month\n- 10 WhatsApp numbers\n- 15 team members\n- Advanced features\n\n*Enterprise Plan* - Custom pricing\n- Unlimited numbers\n- Unlimited team members\n- Custom automation"
    };
  } else if (lowerText.startsWith('/casestudies') || lowerText.includes('case study') || lowerText.includes('success story')) {
    return {
      type: 'caseStudies',
      message: "📚 *Success Stories* 📚\n\n1. *E-commerce Business*\n   - 40% increase in satisfaction\n   - 3x faster response time\n\n2. *Real Estate Agency*\n   - 60% more leads captured\n   - 24/7 customer support\n\n3. *Healthcare Provider*\n   - 50% reduction in no-shows"
    };
  } else if (lowerText.includes('whatsapp') || lowerText.includes('number')) {
    return {
      type: 'info',
      message: "Periskope allows you to connect multiple WhatsApp numbers without requiring the WhatsApp Business API. Would you like to know more about this feature?"
    };
  } else if (lowerText.includes('api') || lowerText.includes('business api')) {
    return {
      type: 'info',
      message: "One of the key advantages of Periskope is that you don't need the WhatsApp Business API to get started. You can connect any WhatsApp number and start managing your communications right away."
    };
  } else if (lowerText.includes('thanks') || lowerText.includes('thank you')) {
    return {
      type: 'acknowledgment',
      message: "You're welcome! Feel free to sign up for free or book a demo if you'd like to see Periskope in action."
    };
  } else if (lowerText.includes('demo')) {
    return {
      type: 'cta',
      message: "You can book a personalized demo with our team by clicking the 'Book a Demo' button on our homepage. Would you like me to point you to that?"
    };
  } else if (lowerText.includes('sign up') || lowerText.includes('signup') || lowerText.includes('register')) {
    return {
      type: 'cta',
      message: "Great! You can sign up for free by clicking the 'Sign Up for Free' button on our homepage. No credit card required to get started."
    };
  } else {
    return {
      type: 'help',
      message: "🤖 *How can I help you?* 🤖\n\nTry asking about:\n- Features\n- Pricing\n- Case studies\n- Sign up process\n- Or ask any question about Periskope!"
    };
  }
};

module.exports = {
  processMessage
};