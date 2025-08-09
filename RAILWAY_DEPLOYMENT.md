# Railway Backend Deployment Guide

## 🚂 Deploying Your Business Ideas Backend API to Railway

This guide covers deploying your Node.js/Express backend API to Railway using Nixpacks.

## ✅ Files Ready for Deployment

- `nixpacks.toml` - Railway build configuration
- `package.json` - Root package.json for monorepo support
- `server/package.json` - Backend dependencies
- `server/index.js` - Main server file

## 🔑 Required Environment Variables

Set these environment variables in your Railway project dashboard:

### Essential Variables
```bash
NODE_ENV=production
PORT=3000                    # Railway will override this automatically
JWT_SECRET=your-super-secret-jwt-key-here
```

### Database (if using PostgreSQL)
```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

### Google OAuth (if using Google sign-in)
```bash
GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### Stripe Payment Processing
```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 🚀 Deployment Steps

1. **Connect Repository to Railway**
   - Go to [Railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

2. **Configure Environment Variables**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add all required environment variables listed above

3. **Deploy**
   - Railway will automatically detect the `nixpacks.toml` configuration
   - The build will install dependencies from `/server` directory
   - Server will start on Railway's assigned port

## 📡 API Endpoints

Your deployed API will be available at: `https://your-project-name.railway.app`

Key endpoints:
- `GET /api/ideas` - Get business ideas
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `POST /api/saved-ideas` - Save business ideas

## 🔧 Local Development vs Production

- **Local**: Server runs on `http://localhost:5000`
- **Railway**: Server runs on `https://your-project-name.railway.app`
- **Port**: Railway automatically assigns and provides the PORT environment variable

## 🐛 Troubleshooting

### Build Issues
- Check that all environment variables are set
- Verify `nixpacks.toml` is in the root directory
- Ensure `server/package.json` has correct dependencies

### Runtime Issues
- Check Railway logs for error messages
- Verify database connection if using PostgreSQL
- Ensure JWT_SECRET is set for authentication

## 📝 Notes

- The frontend (client) is NOT deployed with this configuration
- This deploys only the backend API server
- Frontend should be deployed separately (e.g., on Netlify, Vercel)
- Update frontend API URLs to point to your Railway backend URL
