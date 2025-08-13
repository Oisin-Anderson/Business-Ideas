// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key');

// Debug Stripe configuration
console.log('🔍 Stripe Configuration Debug:');
console.log('   Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');
console.log('   Using key:', process.env.STRIPE_SECRET_KEY ? 'Environment variable' : 'Placeholder');
console.log();
const businessIdeas = require('./data/businessIdeas');
const { addUser, updateUser, findUserById, findUserByEmail, addSavedIdea, removeSavedIdea, getSavedIdeas, isIdeaSaved } = require('./data/users');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-google-client-id';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(helmet());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        /^https:\/\/.*\.netlify\.app$/, // Allow any Netlify domain
        /^https:\/\/.*\.netlify\.com$/, // Allow any Netlify domain
        'https://your-custom-domain.com' // Add your custom domain if you have one
      ]
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// CORS debugging middleware
app.use((req, res, next) => {
  console.log('🌐 CORS Debug:', {
    method: req.method,
    origin: req.headers.origin,
    url: req.url,
    userAgent: req.headers['user-agent']
  });
  next();
});

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      email,
      password: hashedPassword
    };

    const createdUser = await addUser(newUser);

    // Create JWT token
    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        subscription_status: user.subscription_status,
        subscription_renewal_date: user.subscription_renewal_date,
        subscription_expiry_date: user.subscription_expiry_date,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// Google OAuth Authentication
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await findUserByEmail(email);

    if (!user) {
      // Create new user with Google info
      const newUser = {
        email,
        password: '', // Google users don't need password
        google_id: googleId
      };
      user = await addUser(newUser);
    } else {
      // Update existing user with Google info if not present
      const updates = {};
      if (!user.google_id) {
        updates.google_id = googleId;
      }
      if (updates.google_id) {
        user = await updateUser(user.id, updates);
      }
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Saved Ideas Routes
app.post('/api/saved-ideas', auth, async (req, res) => {
  try {
    const { ideaId } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!ideaId) {
      return res.status(400).json({ message: 'Idea ID is required' });
    }

    // Find user to make sure they exist
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the idea
    const savedIdea = await addSavedIdea(userId, ideaId);
    
    if (savedIdea.already_saved) {
      return res.status(200).json({ 
        message: 'Idea already saved',
        ideaId: ideaId,
        alreadySaved: true
      });
    }

    res.status(201).json({ 
      message: 'Idea saved successfully',
      ideaId: ideaId,
      savedAt: savedIdea.created_at
    });
  } catch (error) {
    console.error('Save idea error:', error);
    res.status(500).json({ message: 'Server error while saving idea' });
  }
});

app.delete('/api/saved-ideas/:ideaId', auth, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.userId;

    // Find user to make sure they exist
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the saved idea
    const removedIdea = await removeSavedIdea(userId, ideaId);
    
    if (!removedIdea) {
      return res.status(404).json({ 
        message: 'Idea was not in saved list'
      });
    }

    res.json({ 
      message: 'Idea removed from saved list',
      ideaId: ideaId
    });
  } catch (error) {
    console.error('Remove saved idea error:', error);
    res.status(500).json({ message: 'Server error while removing saved idea' });
  }
});

app.get('/api/saved-ideas', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user to make sure they exist
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get saved idea IDs from database
    const savedIdeasData = await getSavedIdeas(userId);
    const savedIdeaIds = savedIdeasData.map(item => item.idea_id);

    // Get full business idea details for each saved idea
    const savedIdeas = businessIdeas.filter(idea => 
      savedIdeaIds.includes(idea.id)
    );

    // Add saved date to each idea
    const savedIdeasWithDates = savedIdeas.map(idea => {
      const savedData = savedIdeasData.find(item => item.idea_id === idea.id);
      return {
        ...idea,
        savedAt: savedData.created_at
      };
    });

    res.json({ 
      savedIdeas: savedIdeasWithDates,
      total: savedIdeasWithDates.length
    });
  } catch (error) {
    console.error('Get saved ideas error:', error);
    res.status(500).json({ message: 'Server error while fetching saved ideas' });
  }
});

// Check if a specific idea is saved by the user
app.get('/api/saved-ideas/check/:ideaId', auth, async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.userId;

    const isSaved = await isIdeaSaved(userId, ideaId);
    
    res.json({ 
      isSaved: isSaved,
      ideaId: ideaId
    });
  } catch (error) {
    console.error('Check saved idea error:', error);
    res.status(500).json({ message: 'Server error while checking saved idea' });
  }
});

// API Routes
app.get('/api/ideas', (req, res) => {
  const { categories, search, investmentLevels, difficulties, page = 1, limit = 12 } = req.query;
  let filteredIdeas = [...businessIdeas];

  // Filter by multiple categories
  if (categories && categories !== '') {
    const categoryArray = categories.split(',').filter(cat => cat.trim() !== '');
    if (categoryArray.length > 0) {
      filteredIdeas = filteredIdeas.filter(idea => 
        idea.categories.some(cat => categoryArray.includes(cat))
      );
    }
  }

  // Filter by multiple investment levels
  if (investmentLevels && investmentLevels !== '') {
    const levelArray = investmentLevels.split(',').filter(level => level.trim() !== '');
    if (levelArray.length > 0) {
      filteredIdeas = filteredIdeas.filter(idea => 
        levelArray.includes(idea.investmentLevel)
      );
    }
  }

  // Filter by multiple difficulties
  if (difficulties && difficulties !== '') {
    const difficultyArray = difficulties.split(',').filter(difficulty => difficulty.trim() !== '');
    if (difficultyArray.length > 0) {
      filteredIdeas = filteredIdeas.filter(idea => 
        difficultyArray.includes(idea.difficulty)
      );
    }
  }

  // Search functionality
  if (search) {
    const searchLower = search.toLowerCase();
    filteredIdeas = filteredIdeas.filter(idea =>
      idea.title.toLowerCase().includes(searchLower) ||
      idea.description.toLowerCase().includes(searchLower) ||
      idea.categories.some(cat => cat.toLowerCase().includes(searchLower))
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedIdeas = filteredIdeas.slice(startIndex, endIndex);

  res.json({
    ideas: paginatedIdeas,
    total: filteredIdeas.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredIdeas.length / limit)
  });
});

app.get('/api/ideas/:id', (req, res) => {
  const idea = businessIdeas.find(idea => idea.id === req.params.id);
  if (!idea) {
    return res.status(404).json({ message: 'Business idea not found' });
  }
  
  // Find related ideas
  const relatedIdeas = [];
  const usedIds = new Set([idea.id]); // Track used IDs to avoid duplicates
  
  // Find idea with most similar categories
  const categoryMatches = businessIdeas
    .filter(otherIdea => otherIdea.id !== idea.id)
    .map(otherIdea => {
      const commonCategories = idea.categories.filter(cat => 
        otherIdea.categories.includes(cat)
      );
      return {
        idea: otherIdea,
        commonCount: commonCategories.length,
        commonCategories
      };
    })
    .filter(match => match.commonCount > 0)
    .sort((a, b) => b.commonCount - a.commonCount);
  
  if (categoryMatches.length > 0) {
    const bestCategoryMatch = categoryMatches[0];
    relatedIdeas.push({
      ...bestCategoryMatch.idea,
      relationType: 'similar-categories',
      relationDescription: `Shares ${bestCategoryMatch.commonCount} categories: ${bestCategoryMatch.commonCategories.join(', ')}`
    });
    usedIds.add(bestCategoryMatch.idea.id);
  }
  
  // Find idea with same investment level
  const sameInvestment = businessIdeas.find(otherIdea => 
    otherIdea.id !== idea.id && 
    otherIdea.investmentLevel === idea.investmentLevel &&
    !usedIds.has(otherIdea.id)
  );
  
  if (sameInvestment) {
    relatedIdeas.push({
      ...sameInvestment,
      relationType: 'same-investment',
      relationDescription: `Same investment level: ${sameInvestment.investmentLevel}`
    });
    usedIds.add(sameInvestment.id);
  }
  
  // Find idea with same difficulty
  const sameDifficulty = businessIdeas.find(otherIdea => 
    otherIdea.id !== idea.id && 
    otherIdea.difficulty === idea.difficulty &&
    !usedIds.has(otherIdea.id)
  );
  
  if (sameDifficulty) {
    relatedIdeas.push({
      ...sameDifficulty,
      relationType: 'same-difficulty',
      relationDescription: `Same difficulty level: ${sameDifficulty.difficulty}`
    });
    usedIds.add(sameDifficulty.id);
  }
  
  // If we don't have 3 related ideas yet, add more category matches
  if (relatedIdeas.length < 3 && categoryMatches.length > 1) {
    for (let i = 1; i < categoryMatches.length && relatedIdeas.length < 3; i++) {
      const match = categoryMatches[i];
      if (!usedIds.has(match.idea.id)) {
        relatedIdeas.push({
          ...match.idea,
          relationType: 'similar-categories',
          relationDescription: `Shares ${match.commonCount} categories: ${match.commonCategories.join(', ')}`
        });
        usedIds.add(match.idea.id);
      }
    }
  }
  
  // If the idea has a contentFile, read the content from the file
  if (idea.contentFile) {
    try {
      const contentPath = path.join(__dirname, 'data', idea.contentFile);
      const fullContent = fs.readFileSync(contentPath, 'utf8');
      const ideaWithContent = { 
        ...idea, 
        fullContent,
        relatedIdeas: relatedIdeas.slice(0, 3) // Limit to 3 related ideas
      };
      res.json(ideaWithContent);
    } catch (error) {
      console.error('Error reading content file:', error);
      res.json({
        ...idea,
        relatedIdeas: relatedIdeas.slice(0, 3)
      });
    }
  } else {
    res.json({
      ...idea,
      relatedIdeas: relatedIdeas.slice(0, 3)
    });
  }
});

app.get('/api/categories', (req, res) => {
  // Count occurrences of each category
  const categoryCounts = {};
  businessIdeas.forEach(idea => {
    idea.categories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });
  
  // Convert to array and sort by count (descending)
  const categoriesWithCounts = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
  
  res.json(categoriesWithCounts);
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalIdeas: businessIdeas.length,
    categories: [...new Set(businessIdeas.flatMap(idea => idea.categories))].length,
    lowBudgetIdeas: businessIdeas.filter(idea => idea.investmentLevel === 'low').length,
    onlineIdeas: businessIdeas.filter(idea => idea.categories.includes('online')).length,
    homeBasedIdeas: businessIdeas.filter(idea => idea.categories.includes('home-based')).length
  };
  res.json(stats);
});

// Stripe Routes
app.post('/api/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: req.user.userId,
        email: req.user.email
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Test route to verify routing is working
app.post('/api/test-subscription', (req, res) => {
  console.log('🔍 Test subscription route reached');
  res.json({ message: 'Test route working' });
});

app.post('/api/create-subscription', auth, async (req, res) => {
  console.log('🔍 POST /api/create-subscription endpoint reached');
  try {
    const { priceId } = req.body;
    const userId = req.user.userId;

    console.log('🔍 Creating subscription:');
    console.log('   Price ID:', priceId);
    console.log('   User ID:', userId);

    // Find user
    console.log('🔍 Looking for user with ID:', userId);
    const user = await findUserById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('✅ User found:', user.email);

    // Create or retrieve Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      
      // Update user with Stripe customer ID
      await updateUser(user.id, { stripe_customer_id: customer.id });
    }

    // Get the price to get the amount
    console.log('🔍 Getting price details...');
    const price = await stripe.prices.retrieve(priceId);
    console.log('🔍 Price amount:', price.unit_amount, price.currency);

    // Create setup intent for subscription
    console.log('🔍 Creating setup intent...');
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId: user.id,
        priceId: priceId,
        type: 'subscription'
      }
    });
    console.log('🔍 Setup intent created:', setupIntent.id);

    // Create subscription
    console.log('🔍 Creating Stripe subscription...');
    console.log('   Customer ID:', customer.id);
    console.log('   Price ID:', priceId);
    
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      collection_method: 'charge_automatically',
    });
    console.log('🔍 Stripe subscription created:', subscription.id);

    console.log('🔍 Subscription created successfully');
    console.log('🔍 Subscription details:', {
      id: subscription.id,
      status: subscription.status,
      setupIntentId: setupIntent.id
    });

    console.log('✅ Setup intent found:', setupIntent.id);
    
    res.json({
      subscriptionId: subscription.id,
      clientSecret: setupIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    res.status(500).json({ 
      message: 'Failed to create subscription',
      error: error.message 
    });
  }
});

app.post('/api/create-lifetime-payment', auth, async (req, res) => {
  try {
    const { priceId } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create or retrieve Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      
      // Update user with Stripe customer ID
      await updateUser(user.id, { stripe_customer_id: customer.id });
    }

    // Get the price to get the amount
    const price = await stripe.prices.retrieve(priceId);

    // Create payment intent for one-time payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      customer: customer.id,
      metadata: {
        userId: user.id,
        priceId: priceId,
        type: 'lifetime'
      }
    });

    res.json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating lifetime payment:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    res.status(500).json({ 
      message: 'Failed to create lifetime payment',
      error: error.message 
    });
  }
});

app.get('/api/subscription-status', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await findUserById(userId);
    
    if (!user || !user.stripeCustomerId) {
      return res.json({
        isSubscribed: false,
        subscription: null
      });
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      expand: ['data.default_payment_method']
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      
      // Update user with subscription dates
      const renewalDate = new Date(subscription.current_period_end * 1000);
      const expiryDate = subscription.cancel_at_period_end 
        ? new Date(subscription.current_period_end * 1000)
        : null; // For active recurring subscriptions, no expiry
      
      await updateUserSubscription(user.id, {
        subscriptionStatus: 'premium',
        subscriptionId: subscription.id,
        renewalDate: renewalDate,
        expiryDate: expiryDate
      });
      
      res.json({
        isSubscribed: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          plan: subscription.items.data[0].price,
          renewalDate: renewalDate,
          expiryDate: expiryDate
        }
      });
    } else {
      // Check for lifetime payments
      const paymentIntents = await stripe.paymentIntents.list({
        customer: user.stripeCustomerId,
        limit: 100
      });

      const lifetimePayment = paymentIntents.data.find(payment => 
        payment.metadata.type === 'lifetime' && 
        payment.status === 'succeeded'
      );

      if (lifetimePayment) {
        // Get the price details
        const price = await stripe.prices.retrieve(lifetimePayment.metadata.priceId);
        
        // Update user with lifetime subscription (no expiry date)
        await updateUserSubscription(user.id, {
          subscriptionStatus: 'lifetime',
          subscriptionId: lifetimePayment.id,
          renewalDate: null, // Lifetime doesn't renew
          expiryDate: null   // Lifetime doesn't expire
        });
        
        res.json({
          isSubscribed: true,
          subscription: {
            id: lifetimePayment.id,
            status: 'active',
            currentPeriodEnd: null, // Lifetime has no end date
            cancelAtPeriodEnd: false,
            plan: price,
            isLifetime: true,
            renewalDate: null,
            expiryDate: null
          }
        });
      } else {
        res.json({
          isSubscribed: false,
          subscription: null
        });
      }
    }
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ message: 'Failed to get subscription status' });
  }
});

app.post('/api/cancel-subscription', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await findUserById(userId);
    
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active'
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    const subscription = subscriptions.data[0];
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will be cancelled at the end of the current period' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

// Stripe Webhook Endpoint
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      // Handle subscription created
      console.log('Subscription created:', event.data.object.id);
      break;
    case 'customer.subscription.updated':
      // Handle subscription updated
      console.log('Subscription updated:', event.data.object.id);
      break;
    case 'customer.subscription.deleted':
      // Handle subscription deleted
      console.log('Subscription deleted:', event.data.object.id);
      break;
    case 'invoice.payment_succeeded':
      // Handle successful payment
      console.log('Payment succeeded:', event.data.object.id);
      break;
    case 'invoice.payment_failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Serve static files in production (but only for Railway backend - we're not serving frontend from here)
// The frontend is deployed separately on Netlify, so we don't need this for Railway
if (process.env.NODE_ENV === 'production' && process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // For Railway deployment: Only serve API, no frontend files
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Business Ideas API Server', 
      status: 'running',
      endpoints: {
        ideas: '/api/ideas',
        categories: '/api/categories',
        stats: '/api/stats',
        auth: '/api/auth/*'
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 