# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Business Ideas application.

## Prerequisites

1. A Google account
2. Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Business Ideas App")
5. Click "Create"

## Step 2: Enable the Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google Identity" and then "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required information (App name, User support email, Developer contact information)
   - Add your domain to authorized domains
   - Save and continue

4. Create the OAuth client ID:
   - Application type: "Web application"
   - Name: "Business Ideas Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Click "Create"

5. Copy the Client ID (you'll need this for both client and server)

## Step 4: Configure Environment Variables

### Server Configuration

Create a `.env` file in the `server` directory:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
JWT_SECRET=your-jwt-secret-key-here
```

### Client Configuration

Update the `client/src/App.js` file and replace `"your-google-client-id"` with your actual Google Client ID:

```javascript
<GoogleOAuthProvider clientId="your-actual-google-client-id-here">
```

## Step 5: Test the Setup

1. Start your server: `cd server && npm start`
2. Start your client: `cd client && npm start`
3. Navigate to the authentication page
4. Try signing in with Google

## Troubleshooting

### Common Issues

1. **"Invalid client" error**: Make sure your Google Client ID is correct and the domain is authorized
2. **"Redirect URI mismatch"**: Ensure the redirect URI in Google Console matches your app's URL
3. **CORS errors**: Make sure your server is running and the client is configured to proxy to the correct port

### Security Notes

- Never commit your Google Client ID or JWT secret to version control
- Use environment variables for sensitive configuration
- In production, use HTTPS and add your production domain to authorized origins
- Regularly rotate your JWT secret

## Production Deployment

When deploying to production:

1. Update the authorized origins in Google Cloud Console to include your production domain
2. Set up environment variables on your hosting platform
3. Ensure your domain uses HTTPS
4. Update the Google Client ID in your production build

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Documentation](https://github.com/MomenSherif/react-oauth)
- [Google Cloud Console](https://console.cloud.google.com/) 