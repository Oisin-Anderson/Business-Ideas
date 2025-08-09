require('dotenv').config();
const { Pool } = require('pg');

console.log('Testing Supabase connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);

// Mask the password in the URL for logging
const maskedUrl = process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@');
console.log('DATABASE_URL format:', maskedUrl);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('\n🔍 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to Supabase!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    client.release();
    await pool.end();
    console.log('✅ Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error hostname:', error.hostname);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Suggestions:');
      console.log('1. Check your Supabase project reference in the URL');
      console.log('2. Verify your DATABASE_URL format in .env file');
      console.log('3. Make sure your Supabase project is active');
      console.log('4. Try using the connection pooler URL instead');
    }
    process.exit(1);
  }
}

testConnection();
