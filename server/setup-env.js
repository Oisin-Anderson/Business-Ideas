const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Database Setup Helper');
console.log('==================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Please backup and remove it first if you want to create a new one.');
  process.exit(1);
}

// Create .env template
const envTemplate = `# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Supabase Database Configuration
# Replace with your actual Supabase connection string
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Optional: Supabase API Keys (if you want to use Supabase client later)
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
`;

fs.writeFileSync(envPath, envTemplate);

console.log('✅ Created .env file with template');
console.log('\n📝 Next steps:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to Settings > Database');
console.log('3. Copy the "URI" connection string');
console.log('4. Replace the DATABASE_URL in the .env file');
console.log('5. Update other environment variables as needed');
console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('\n💡 Don\'t forget to add .env to your .gitignore file!');
