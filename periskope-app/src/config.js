// API Configuration
export const API_CONFIG = {
  // Get API URL from environment variables with fallback
  get API_BASE_URL() {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  },
  
  // API Endpoints
  ENDPOINTS: {
    PROCESS_MESSAGE: '/api/process-message',
    // Add other API endpoints here
  },
  
  // Get full API URL for an endpoint
  getUrl(endpoint) {
    // Remove any trailing slashes from the base URL
    const baseUrl = this.API_BASE_URL.replace(/\/+$/, '');
    // Ensure endpoint starts with a slash
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${normalizedEndpoint}`;
  },
  
  // Helper to check if running in production
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  }
};

// Log the current configuration in development
if (process.env.NODE_ENV !== 'production') {
  console.log('API Configuration:', {
    API_BASE_URL: API_CONFIG.API_BASE_URL,
    isProduction: API_CONFIG.isProduction
  });
}

export default API_CONFIG;
