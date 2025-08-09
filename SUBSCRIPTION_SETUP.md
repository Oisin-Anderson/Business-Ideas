# Stripe Billing Integration Setup

This guide will help you set up direct Stripe billing for your Business Ideas website.

## Prerequisites

1. A Stripe account  
2. Your existing Business Ideas website

## 📋 **Quick Checklist**
- [ ] Create Stripe products and get Price IDs
- [ ] Set up environment variables
- [ ] Test the integration

## Step 1: Stripe Setup

### 1.1 Create Stripe Products
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Create Products:**
   - Click **"Products"** in left sidebar
   - Click **"Add product"**
   - **Product 1:**
     - Name: `Premium Monthly`
     - Description: `Monthly premium subscription`
   - **Product 2:**
     - Name: `Premium Yearly`
     - Description: `Yearly premium subscription`

### 1.2 Create Recurring Prices
1. **For Premium Monthly:**
   - Click **"Add pricing"** 
   - Select **"Recurring"**
   - Price: `$11.99` (or your amount)
   - Billing period: **"Monthly"**
   - **Copy the Price ID** (starts with `price_1...`) - you'll need this!

2. **For Premium Yearly:**
   - Click **"Add pricing"**
   - Select **"Recurring"** 
   - Price: `$23.99` (or your amount)
   - Billing period: **"Yearly"**
   - **Copy the Price ID** - you'll need this too!

3. **For Premium Lifetime:**
   - Click **"Add pricing"**
   - Select **"One time"** (not recurring)
   - Price: `$47.99` (or your amount)
   - **Copy the Price ID** - you'll need this too!

### 1.3 Get Your Stripe Keys
1. Go to **"Developers"** → **"API keys"**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)

## Step 2: Environment Variables

### 2.1 Client Environment Variables
Create a `.env` file in the `client` directory:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
REACT_APP_STRIPE_MONTHLY_PRICE_ID=price_1ABC123_monthly_from_stripe
REACT_APP_STRIPE_YEARLY_PRICE_ID=price_1XYZ789_yearly_from_stripe
REACT_APP_STRIPE_LIFETIME_PRICE_ID=price_1DEF456_lifetime_from_stripe
```

### 2.2 Server Environment Variables
Create a `.env` file in the `server` directory:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Step 3: Update Configuration

### 3.1 Update Stripe Keys
In `client/src/components/SubscriptionModal.js`:
```javascript
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your-stripe-publishable-key');
```

In `server/index.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key');
```

## Step 4: Testing

### 4.1 Test Subscription Flow
1. Start your development server
2. Create a test account
3. Navigate to the Profile page
4. Click "Get Full Access"
5. Test the subscription purchase flow with Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`

### 4.2 Test Stripe Webhooks (Optional)
1. Set up Stripe webhooks for subscription events
2. Configure webhook endpoints in your server
3. Test subscription lifecycle events

## Step 5: Production Deployment

### 5.1 Update Environment Variables
Replace test keys with production keys:
- Use production Stripe keys
- Update Google OAuth client ID

### 5.2 Configure Webhooks
Set up production webhook endpoints for:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Features Implemented

✅ **Profile Page**: User profile with subscription status
✅ **User Dropdown**: Email dropdown with Profile option
✅ **Subscription Status**: Real-time subscription information
✅ **Payment Integration**: Direct Stripe payment processing
✅ **Logout Confirmation**: Confirmation dialog before logout
✅ **Toast Notifications**: User feedback for actions
✅ **Restore Purchases**: Ability to restore previous purchases
✅ **Subscription Modal**: Clean payment interface with Stripe Elements
✅ **Cancel Subscription**: Ability to cancel subscriptions

## File Structure

```
client/src/
├── components/
│   ├── Header.js (updated with dropdown)
│   └── SubscriptionModal.js (updated with Stripe Elements)
├── contexts/
│   └── SubscriptionContext.js (updated for Stripe)
├── pages/
│   └── ProfilePage.js (subscription management)
├── services/
│   └── subscriptionService.js (updated for Stripe)
└── App.js (updated with routes and providers)

server/
└── index.js (Stripe subscription endpoints)
```

## Troubleshooting

### Common Issues

1. **Stripe Price IDs not working**
   - Ensure you copied the **Price ID** (starts with `price_1...`)
   - NOT the Product ID (starts with `prod_...`)
   - The Price ID is found in the pricing section of each product

2. **Payments failing**
   - Check Stripe keys are correct (publishable and secret)
   - Test with Stripe test cards: `4242 4242 4242 4242`
   - Verify webhook endpoints if using them

3. **Subscription status not updating**
   - Check that the user has a `stripeCustomerId` in the database
   - Verify the subscription status endpoint is working
   - Check server logs for errors

4. **Card element not loading**
   - Ensure `@stripe/react-stripe-js` is installed
   - Check that the publishable key is correct
   - Verify the Elements component is properly wrapped

5. **Client secret errors**
   - Check that the subscription creation endpoint is working
   - Verify the price ID mapping in the subscription service
   - Ensure the server is properly handling the Stripe API calls

### Support

For additional help:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Components](https://stripe.com/docs/stripe-js/react)
- Check server and client console logs for errors 