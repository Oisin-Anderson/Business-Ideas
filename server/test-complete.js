const axios = require('axios');

const baseURL = 'http://localhost:5000';
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'testpass123';

async function runCompleteTest() {
  console.log('🚀 Testing Complete Supabase Integration');
  console.log('=====================================\n');
  
  try {
    // Test 1: Basic API
    console.log('1. Testing basic API...');
    const statsResponse = await axios.get(`${baseURL}/api/stats`);
    console.log('✅ Stats API working:', statsResponse.data);
    
    // Test 2: User Registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${baseURL}/api/auth/register`, {
      email: testEmail,
      password: testPassword
    });
    
    const { user, token } = registerResponse.data;
    console.log('✅ User registered successfully!');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Token length:', token.length);
    
    // Test 3: User Login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    
    const loginToken = loginResponse.data.token;
    console.log('✅ User login successful!');
    console.log('   Token received:', !!loginToken);
    
    // Test 4: Protected endpoint
    console.log('\n4. Testing protected endpoint...');
    const authHeaders = { Authorization: `Bearer ${loginToken}` };
    const meResponse = await axios.get(`${baseURL}/api/auth/me`, { headers: authHeaders });
    console.log('✅ Protected endpoint working:', meResponse.data);
    
    // Test 5: Saved ideas
    console.log('\n5. Testing saved ideas...');
    const saveIdeaResponse = await axios.post(`${baseURL}/api/saved-ideas`, 
      { ideaId: 'test-idea-123' }, 
      { headers: authHeaders }
    );
    console.log('✅ Save idea working:', saveIdeaResponse.data);
    
    const getSavedResponse = await axios.get(`${baseURL}/api/saved-ideas`, { headers: authHeaders });
    console.log('✅ Get saved ideas working:', getSavedResponse.data);
    
    // Test 6: Business ideas API
    console.log('\n6. Testing business ideas API...');
    const ideasResponse = await axios.get(`${baseURL}/api/ideas`);
    console.log('✅ Business ideas API working!');
    console.log('   Total ideas:', ideasResponse.data.total);
    console.log('   Ideas per page:', ideasResponse.data.ideas.length);
    
    console.log('\n🎉 ALL TESTS PASSED! Your Supabase integration is working perfectly!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Database connection');
    console.log('   ✅ User registration');
    console.log('   ✅ User authentication');
    console.log('   ✅ Protected routes');
    console.log('   ✅ Saved ideas functionality');
    console.log('   ✅ Business ideas API');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure your server is running: node index.js');
  }
}

// Install axios if needed, then run tests
try {
  require('axios');
  runCompleteTest();
} catch (error) {
  console.log('📦 Installing axios for testing...');
  require('child_process').exec('npm install axios', (err, stdout, stderr) => {
    if (err) {
      console.log('❌ Please install axios manually: npm install axios');
      console.log('Then run: node test-complete.js');
    } else {
      console.log('✅ axios installed, running tests...\n');
      delete require.cache[require.resolve('axios')];
      runCompleteTest();
    }
  });
}
