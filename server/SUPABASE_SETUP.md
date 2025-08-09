# Supabase Setup Guide

## Environment Variables Setup

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
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
```

## Getting Your Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Find the "Connection string" section
4. Copy the "URI" connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. Replace `[YOUR-PROJECT-REF]` with your project reference

## Database Schema Setup

The database schema will be automatically created when you start the server. The schema includes:

- `users` table with email, password, Google ID, and subscription fields
- Indexes for faster queries
- Automatic timestamp updates

## Testing the Connection

After setting up your `.env` file, start the server:

```bash
npm run dev
```

You should see:
- ✅ Connected to Supabase PostgreSQL database
- ✅ Database schema initialized successfully

## Troubleshooting

If you see connection errors:
1. Verify your `DATABASE_URL` is correct
2. Check that your Supabase project is active
3. Ensure your IP is allowed in Supabase (or disable IP restrictions for development)
4. Verify your database password is correct
