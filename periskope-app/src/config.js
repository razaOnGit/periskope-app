// API Configuration
export const API_CONFIG = {
  // Get API URL from environment variables with fallback
  get API_BASE_URL() {
    // In production, use the production URL from environment variables
    if (process.env.NODE_ENV === 'production') {
      return process.env.REACT_APP_API_URL || 'https://periskope-app-backend.onrender.com';
    }
    // In development, prefer the .env file, fallback to localhost
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  },
  
  // API Endpoints
  ENDPOINTS: {
    PROCESS_MESSAGE: '/api/process-message',
    HEALTH: '/health',
    // Add other API endpoints here
  },
  
  // Default request timeout in milliseconds
  TIMEOUT: 30000, // 30 seconds
  
  // Get full API URL for an endpoint
  getUrl(endpoint) {
    try {
      if (!endpoint) {
        throw new Error('Endpoint is required');
      }
      
      // Remove any trailing slashes from the base URL
      const baseUrl = this.API_BASE_URL.replace(/\/+$/, '');
      // Ensure endpoint starts with a slash
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      const fullUrl = `${baseUrl}${normalizedEndpoint}`;
      
      // Log in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`API URL for ${endpoint}:`, fullUrl);
      }
      
      return fullUrl;
    } catch (error) {
      console.error('Error constructing API URL:', {
        endpoint,
        error: error.message
      });
      throw error;
    }
  },
  
  // Helper to check if running in production
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  
  // Check if the API is reachable
  async checkHealth() {
    try {
      const response = await fetch(this.getUrl(this.ENDPOINTS.HEALTH), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

// Log the current configuration
console.group('API Configuration');
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_CONFIG.API_BASE_URL);
console.log('Is Production:', API_CONFIG.isProduction);

// Perform health check in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Performing health check...');
  API_CONFIG.checkHealth()
    .then(data => console.log('Backend health check:', data))
    .catch(error => console.warn('Backend health check failed:', error.message))
    .finally(() => console.groupEnd());
} else {
  console.groupEnd();
}

export default API_CONFIG;
