// API Configuration
const config = {
  // Use environment variable if available, otherwise default to localhost for development
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your-stripe-publishable-key'
};

// Debug logging for production
console.log('🔍 Frontend Configuration Debug:');
console.log('   Environment:', process.env.NODE_ENV);
console.log('   API_BASE_URL:', config.API_BASE_URL);
console.log('   REACT_APP_API_URL env var:', process.env.REACT_APP_API_URL);
console.log('   Expected Railway URL: https://business-ideas-production.up.railway.app');

export default config;
