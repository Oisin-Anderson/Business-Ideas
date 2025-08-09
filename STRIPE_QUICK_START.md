# Stripe Quick Start Guide

## ✅ What I've Fixed

1. **Created Environment Files**: Set up `client/.env` and `server/.env` with proper structure
2. **Added Debugging**: Added console logs to help identify configuration issues
3. **Created Test Script**: `test-stripe.js` to verify your Stripe setup
4. **Created Setup Guide**: Comprehensive guide in `STRIPE_SETUP_GUIDE.md`

## 🚀 Immediate Steps to Get Stripe Working

### Step 1: Set Up Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a free account
3. Complete your account setup

### Step 2: Get Your Stripe Keys
1. In Stripe Dashboard → **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Step 3: Create Products and Prices
1. Go to **Products** in Stripe Dashboard
2. Create these products:

#### Monthly Subscription
- Name: Premium Monthly
- Price: $11.99/month
- Billing: Recurring (Monthly)
- Copy the Price ID (starts with `price_`)

#### Yearly Subscription
- Name: Premium Yearly  
- Price: $23.99/year
- Billing: Recurring (Yearly)
- Copy the Price ID (starts with `price_`)

#### Lifetime Access
- Name: Premium Lifetime
- Price: $47.99 (one-time)
- Billing: One-time
- Copy the Price ID (starts with `price_`)

### Step 4: Update Environment Files

#### Update `client/.env`:
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
REACT_APP_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
REACT_APP_STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id
REACT_APP_STRIPE_LIFETIME_PRICE_ID=price_your_lifetime_price_id
```

#### Update `server/.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
JWT_SECRET=your_random_secret_here
```

### Step 5: Test Your Setup
```bash
# Test Stripe configuration
node test-stripe.js

# Start your servers
npm run dev
```

### Step 6: Test Payment Flow
1. Go to http://localhost:3000
2. Sign up/login
3. Try to make a payment
4. Use test card: `4242 4242 4242 4242`

## 🔍 Debugging

### Check Browser Console
Look for these debug messages:
```
🔍 Client Stripe Configuration Debug:
   Publishable Key: Set/Not set
   Monthly Price ID: price_xxx/Not set
   ...
```

### Check Server Console
Look for these debug messages:
```
🔍 Stripe Configuration Debug:
   Secret Key: Set/Not set
   Using key: Environment variable/Placeholder
```

### Common Issues & Solutions

#### "Invalid API key" Error
- ✅ Check your Stripe keys are correct
- ✅ Ensure you're using test keys for development
- ✅ Verify keys are in .env files (not placeholder values)

#### "Price not found" Error  
- ✅ Verify your Price IDs are correct
- ✅ Check prices exist in Stripe dashboard
- ✅ Ensure Price IDs match your .env files

#### "Payment failed" Error
- ✅ Use test card: `4242 4242 4242 4242`
- ✅ Check browser console for detailed errors
- ✅ Verify server is running on port 5000

## 📞 Need Help?

1. Run `node test-stripe.js` to diagnose issues
2. Check the comprehensive guide: `STRIPE_SETUP_GUIDE.md`
3. Review browser and server console logs
4. Verify all environment variables are set correctly

## 🎯 Success Checklist

- [ ] Stripe account created
- [ ] API keys obtained and configured
- [ ] Products and prices created in Stripe
- [ ] Environment files updated with real values
- [ ] `node test-stripe.js` passes all tests
- [ ] Payment flow works with test card
- [ ] Subscription status updates correctly
