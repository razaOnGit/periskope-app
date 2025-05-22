import API_CONFIG from '../config';

/**
 * Makes an API request with proper error handling and logging
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The parsed JSON response
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = API_CONFIG.getUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const startTime = performance.now();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeoutId);

    const responseTime = Math.round(performance.now() - startTime);
    
    // Log request details in development
    if (process.env.NODE_ENV !== 'production') {
      console.group(`API Request: ${options.method || 'GET'} ${endpoint}`);
      console.log('URL:', url);
      console.log('Status:', response.status);
      console.log('Time:', `${responseTime}ms`);
      
      if (options.body) {
        console.log('Request Body:', options.body);
      }
    }

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Response:', data);
      console.groupEnd();
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    const errorMessage = error.name === 'AbortError'
      ? `Request timed out after ${API_CONFIG.TIMEOUT}ms`
      : error.message || 'Network request failed';
    
    console.error(`API Error (${endpoint}):`, {
      error: errorMessage,
      url,
      method: options.method || 'GET',
      status: error.response?.status,
    });
    
    throw new Error(errorMessage);
  }
};

/**
 * Sends a message to the chatbot
 * @param {string} message - The message to send
 * @param {string} [userId] - Optional user ID
 * @returns {Promise<Object>} - The chatbot's response
 */
export const sendChatMessage = async (message, userId) => {
  return apiRequest(API_CONFIG.ENDPOINTS.PROCESS_MESSAGE, {
    method: 'POST',
    body: JSON.stringify({ message, userId }),
  });
};

/**
 * Checks if the backend API is reachable
 * @returns {Promise<Object>} - Health check response
 */
export const checkBackendHealth = async () => {
  return API_CONFIG.checkHealth();
};

export default {
  sendChatMessage,
  checkBackendHealth,
  // Add other API functions here
};
