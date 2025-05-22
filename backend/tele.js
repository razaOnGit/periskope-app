// Response templates
const responses = {
  greeting: {
    type: 'greeting',
    message: "👋 Hi there! I'm the Periskope Assistant. How can I help you with your WhatsApp business needs today?"
  },
  pricing: {
    type: 'pricing',
    message: `💰 *Pricing Plans* 💰

*Starter Plan* - $29/month
- 3 WhatsApp numbers
- 5 team members
- Basic automation

*Business Plan* - $99/month
- 10 WhatsApp numbers
- 15 team members
- Advanced features

*Enterprise Plan* - Custom pricing
- Unlimited numbers
- Unlimited team members
- Custom automation

Would you like to sign up for a free trial?`
  },
  features: {
    type: 'features',
    message: `🚀 *Features* 🚀

1. *Multi-Number Inbox*
   - Connect and manage multiple WhatsApp numbers from one platform

2. *Create Tickets & Tasks*
   - Convert WhatsApp queries into tickets

3. *Scheduled Messaging*
   - Schedule messages to groups & 1:1 chats

4. *Shared Inbox for Teams*
   - Collaborate with your team on WhatsApp

5. *Automate Actions*
   - Automate common tasks and workflows

6. *System Integration*
   - Connect with your existing tools and CRM

Would you like to see a demo?`
  },
  caseStudies: {
    type: 'caseStudies',
    message: `📚 *Success Stories* 📚

1. *E-commerce Business*
   - 40% increase in satisfaction
   - 3x faster response time

2. *Real Estate Agency*
   - 60% more leads captured
   - 24/7 customer support

3. *Healthcare Provider*
   - 50% reduction in no-shows

Would you like to see how we can help your business?`
  },
  signup: {
    type: 'cta',
    message: `✨ *Get Started with Periskope* ✨

1. Visit our website: app.periskope.ai/signup
2. Click "Start Free Trial"
3. Complete the quick setup in under 5 minutes

No credit card required. Start with our 14-day free trial!`
  },
  demo: {
    type: 'cta',
    message: `📅 *Book a Personalized Demo*

Let us show you how Periskope can transform your business communications:

1. Live walkthrough of all features
2. Q&A with our product experts
3. Customized to your business needs

Click here to schedule your demo: [Book Demo](https://calendly.com/periskope/demo)`
  }
};

// Process incoming messages with state management
const processMessage = (text, state = {}) => {
  const lowerText = text ? text.trim().toLowerCase() : '';

  // Check for exact matches first
  if (lowerText === '/pricing' || lowerText === 'pricing') {
    return { ...responses.pricing, state };
  }
  
  if (lowerText === '/features' || lowerText === 'features') {
    return { ...responses.features, state };
  }
  
  if (lowerText === '/casestudies' || lowerText === 'case studies' || lowerText === 'casestudies') {
    return { ...responses.caseStudies, state };
  }
  
  if (lowerText === '/signup' || lowerText === 'sign up' || lowerText === 'signup') {
    return { ...responses.signup, state };
  }
  
  if (lowerText === '/demo' || lowerText === 'book demo' || lowerText === 'schedule demo') {
    return { ...responses.demo, state };
  }
  
  // Fuzzy matching for more natural language
  const hasPricing = /\b(price|cost|plan|subscribe|subscription)\b/i.test(lowerText);
  const hasFeatures = /\b(feature|function|capabilit|what can you do)\b/i.test(lowerText);
  const hasCaseStudy = /\b(case stud|success stor|example|client|customer)\b/i.test(lowerText);
  const hasSignup = /\b(sign\s?up|register|create account|get started|free trial)\b/i.test(lowerText);
  const hasDemo = /\b(demo|show me|see it in action|walkthrough)\b/i.test(lowerText);
  const hasGreeting = /\b(hi|hello|hey|greetings|good\s(morning|afternoon|evening))\b/i.test(lowerText);
  const hasThanks = /\b(thank|thanks|appreciate|grateful)\b/i.test(lowerText);
  
  // Handle follow-up questions based on state
  if (state.awaitingSignup) {
    return handleSignupConfirmation(lowerText, state);
  }
  
  // Return responses based on detected intent
  if (hasPricing) return { ...responses.pricing, state };
  if (hasFeatures) return { ...responses.features, state };
  if (hasCaseStudy) return { ...responses.caseStudies, state };
  if (hasSignup) return { ...responses.signup, state };
  if (hasDemo) return { ...responses.demo, state };
  if (hasThanks) return { 
    type: 'acknowledgment', 
    message: "You're welcome! Is there anything else I can help you with?",
    state 
  };
  if (hasGreeting) return responses.greeting;
  
  // Default help response
  return {
    type: 'help',
    message: `🤖 *How can I help you?* 🤖

Try asking about:
• Features
• Pricing
• Case studies
• Sign up process
• Book a demo

Or ask me anything about Periskope!`,
    state
  };
};

// Handle signup confirmation flow
const handleSignupConfirmation = (text, state) => {
  const lowerText = text.toLowerCase();
  
  if (['yes', 'sure', 'ok', 'yep', 'yeah', 'yup'].includes(lowerText)) {
    return {
      ...responses.signup,
      state: { ...state, awaitingSignup: false }
    };
  }
  
  return {
    type: 'info',
    message: "No problem! Let me know if you have any other questions.",
    state: { ...state, awaitingSignup: false }
  };
};

module.exports = {
  processMessage
};