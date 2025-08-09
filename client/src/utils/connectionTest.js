// Connection test utility for debugging API connectivity
import api from '../services/api';
import config from '../config';

export const testAPIConnection = async () => {
  console.log('🔍 Testing API Connection...');
  console.log('API Base URL:', config.API_BASE_URL);
  console.log('Expected Railway URL: https://business-ideas-production.up.railway.app');
  
  try {
    // Test basic connectivity
    const response = await api.get('/api/stats');
    console.log('✅ API Connection successful!');
    console.log('Stats response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API Connection failed:');
    console.error('Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Full error:', error);
    
    // Additional debugging info
    if (error.code === 'ERR_NETWORK') {
      console.error('🚨 Network Error - Check CORS configuration or API URL');
    }
    
    return { success: false, error: error.message };
  }
};

// Add this to your app to test the connection
export const APIConnectionTest = () => {
  const handleTest = async () => {
    await testAPIConnection();
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '10px' }}>
      <h3>API Connection Test</h3>
      <p>Current API URL: {config.API_BASE_URL}</p>
      <button onClick={handleTest} style={{ padding: '10px 20px' }}>
        Test API Connection
      </button>
      <p><small>Check browser console for results</small></p>
    </div>
  );
};
