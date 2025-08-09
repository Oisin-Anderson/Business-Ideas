# Stripe Payment Setup Guide

## Current Issues
Your Stripe payments aren't working because:
1. **Missing Stripe Keys**: You're using placeholder keys instead of real Stripe keys
2. **Missing Price IDs**: Stripe Price IDs are not configured
3. **No Environment Variables**: .env files need to be created

## Step 1: Set Up Stripe Account

### 1.1 Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a free account
3. Complete your account setup

### 1.2 Get Your Stripe Keys
1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 1.3 Create Products and Prices
1. Go to **Products** in your Stripe Dashboard
2. Create three products:

#### Monthly Subscription
- **Name**: Premium Monthly
- **Price**: $11.99/month
- **Billing**: Recurring
- **Billing period**: Monthly
- Copy the **Price ID** (starts with `price_`)

#### Yearly Subscription  
- **Name**: Premium Yearly
- **Price**: $23.99/year
- **Billing**: Recurring
- **Billing period**: Yearly
- Copy the **Price ID** (starts with `price_`)

#### Lifetime Access
- **Name**: Premium Lifetime
- **Price**: $47.99 (one-time)
- **Billing**: One-time
- Copy the **Price ID** (starts with `price_`)

## Step 2: Create Environment Files

### 2.1 Create Client Environment File
Create `client/.env` file:

```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here

# Stripe Price IDs - Replace with your actual Price IDs
REACT_APP_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
REACT_APP_STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id
REACT_APP_STRIPE_LIFETIME_PRICE_ID=price_your_lifetime_price_id

# API Configuration
REACT_APP_API_URL=http://localhost:5000
```

### 2.2 Create Server Environment File
Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_random_jwt_secret_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Step 3: Test the Integration

### 3.1 Start the Servers
```bash
# Install dependencies if not already done
npm run install-all

# Start both servers
npm run dev
```

### 3.2 Test with Stripe Test Cards
Use these test card numbers in the payment form:

- **Successful Payment**: `4242 4242 4242 4242`
- **Declined Payment**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

**Test Card Details**:
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### 3.3 Test the Payment Flow
1. Go to your app (http://localhost:3000)
2. Sign up/login
3. Click on subscription/payment
4. Enter test card details
5. Complete payment

## Step 4: Troubleshooting

### Common Issues

#### 1. "Invalid API key" Error
- Check that your Stripe keys are correct
- Ensure you're using test keys for development
- Verify the keys are properly set in .env files

#### 2. "Price not found" Error
- Verify your Price IDs are correct
- Check that the prices exist in your Stripe dashboard
- Ensure the Price IDs match the ones in your .env files

#### 3. "Payment failed" Error
- Use the correct test card numbers
- Check browser console for detailed error messages
- Verify the server is running and accessible

#### 4. CORS Issues
- Ensure the server is running on port 5000
- Check that CORS is properly configured in server/index.js

### Debug Steps
1. Check browser console for errors
2. Check server console for errors
3. Verify environment variables are loaded:
   ```javascript
   console.log('Stripe Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
   ```

## Step 5: Production Deployment

### 5.1 Switch to Production Keys
1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Switch to **Live** mode
3. Copy your live keys
4. Update your .env files with live keys

### 5.2 Update Price IDs
1. Create live products and prices in Stripe
2. Update your .env files with live Price IDs

### 5.3 Deploy
1. Deploy your server with production environment variables
2. Deploy your client with production Stripe keys
3. Test with real payment methods

## Security Notes

⚠️ **Important Security Reminders**:
- Never commit .env files to version control
- Keep your Stripe secret key secure
- Use test keys for development
- Monitor your Stripe dashboard for any issues

## Support

If you're still having issues:
1. Check the Stripe documentation: https://stripe.com/docs
2. Review the server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test with the provided test card numbers

## Quick Test Checklist

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Products and prices created
- [ ] .env files created with correct values
- [ ] Servers started successfully
- [ ] Test payment with 4242 4242 4242 4242
- [ ] Payment confirmation received
- [ ] Subscription status updated
