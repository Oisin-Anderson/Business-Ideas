# 🌐 Connecting Netlify Frontend to Railway Backend

## 🚀 Quick Setup Guide

### 1. **Get Your Railway Backend URL**
After your Railway deployment succeeds:
- Go to Railway dashboard → Your project
- Copy the domain URL (e.g., `https://business-ideas-backend-production.up.railway.app`)

### 2. **Configure Netlify Environment Variables**
In Netlify dashboard → Site settings → Environment variables:

```bash
# Required: Your Railway backend URL
REACT_APP_API_URL=https://your-railway-app.up.railway.app

# Optional: If using Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Optional: If using Stripe payments
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

### 3. **Update Backend CORS Settings**
In your `server/index.js`, replace the CORS configuration:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-netlify-site.netlify.app',  // ⭐ UPDATE THIS
        'https://your-custom-domain.com'         // ⭐ AND THIS (if you have one)
      ]
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 4. **Add Railway Environment Variable**
In Railway dashboard → Your service → Variables:

```bash
# Add your Netlify domain to allow CORS
FRONTEND_URL=https://your-netlify-site.netlify.app
```

### 5. **Test the Connection**
Add this to any React component to test:

```javascript
import { APIConnectionTest } from '../utils/connectionTest';

// In your component
<APIConnectionTest />
```

Check browser console for connection results.

## 🔧 **Environment Variables Summary**

### **Netlify (Frontend)**
```bash
REACT_APP_API_URL=https://your-railway-backend.up.railway.app
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

### **Railway (Backend)**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://... (if using database)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret
GOOGLE_CLIENT_ID=your-google-client-id
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
- Update the CORS origins in `server/index.js` with your actual Netlify URL
- Redeploy your Railway backend after CORS changes

### **API Not Found Errors**
- Verify `REACT_APP_API_URL` is set correctly in Netlify
- Check that Railway backend is running (visit the URL directly)

### **Authentication Issues**
- Ensure `JWT_SECRET` matches between frontend and backend
- Verify Google OAuth client ID is correct on both sides

## 🔍 **Testing Checklist**

- [ ] Railway backend deploys successfully
- [ ] Backend URL is accessible (visit `/api/stats` endpoint)
- [ ] Netlify environment variables are set
- [ ] Frontend builds and deploys on Netlify
- [ ] API calls work from frontend to backend
- [ ] Authentication flow works end-to-end
- [ ] Payment processing works (if using Stripe)

## 📝 **Next Steps**

1. Deploy backend to Railway
2. Get the Railway URL
3. Set Netlify environment variables
4. Update CORS settings with your Netlify domain
5. Test the connection
6. Go live! 🎉

---

**Your app architecture:**
```
[Users] → [Netlify Frontend] → [Railway Backend] → [Database]
         (React App)         (Node.js API)
```
