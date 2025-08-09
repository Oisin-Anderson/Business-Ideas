const fetch = require('node-fetch').default || require('node-fetch');

async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test 1: Basic stats endpoint
    console.log('1. Testing stats endpoint...');
    const statsResponse = await fetch(`${baseURL}/api/stats`);
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Stats endpoint working:', stats);
    } else {
      console.log('❌ Stats endpoint failed:', statsResponse.status);
    }
    
    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const registerData = {
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };
    
    const registerResponse = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ User registration working!');
      console.log('   User ID:', registerResult.user.id);
      console.log('   Email:', registerResult.user.email);
      console.log('   Token received:', !!registerResult.token);
      
      // Test 3: Login with the same user
      console.log('\n3. Testing user login...');
      const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });
      
      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ User login working!');
        console.log('   Token received:', !!loginResult.token);
      } else {
        console.log('❌ Login failed:', loginResponse.status);
      }
      
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Registration failed:', registerResponse.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your server is running: node index.js');
  }
}

// Check if fetch is available, install if needed
try {
  require('node-fetch');
  testAPI();
} catch (error) {
  console.log('📦 Installing node-fetch for testing...');
  require('child_process').exec('npm install node-fetch', (err, stdout, stderr) => {
    if (err) {
      console.log('❌ Please install node-fetch manually: npm install node-fetch');
      console.log('Then run: node test-api.js');
    } else {
      console.log('✅ node-fetch installed, running tests...');
      testAPI();
    }
  });
}
