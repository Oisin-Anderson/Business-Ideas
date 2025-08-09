const axios = require('axios');

// Test script to check if the profile API returns created_at correctly
async function testProfileAPI() {
  const baseURL = 'http://localhost:5000';
  
  try {
    // First, register or login to get a token
    console.log('1. Testing user login to get token...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'test@example.com', // Use an existing user email
      password: 'testpass123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    // Test the profile endpoint
    console.log('\n2. Testing profile endpoint...');
    const profileResponse = await axios.get(`${baseURL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile API Response:');
    console.log(JSON.stringify(profileResponse.data, null, 2));
    
    // Check specifically for created_at
    const user = profileResponse.data.user;
    console.log('\n3. Checking created_at field:');
    console.log('created_at value:', user.created_at);
    console.log('created_at type:', typeof user.created_at);
    console.log('Is truthy:', !!user.created_at);
    
    if (user.created_at) {
      const date = new Date(user.created_at);
      console.log('Formatted date:', date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Your server is running: node index.js');
    console.log('2. You have a test user with email: test@example.com');
    console.log('3. Or update the email in this test script');
  }
}

testProfileAPI();
