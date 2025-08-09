import axios from 'axios';

class SubscriptionService {
  constructor() {
    this.isInitialized = false;
    this.userId = null;
  }

  async initialize(userId = null) {
    try {
      this.userId = userId;
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize subscription service:', error);
      return false;
    }
  }

  async getCustomerInfo() {
    try {
      const response = await axios.get('/api/subscription-status');
      return response.data;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async getOfferings() {
    try {
      // Return subscription plans directly from Stripe
      return {
        current: {
          availablePackages: [
            {
              identifier: 'premium_monthly',
              product: {
                title: 'Premium Monthly',
                description: 'Monthly premium subscription',
                price: 1199, // $11.99 in cents
                currencyCode: 'USD'
              }
            },
            {
              identifier: 'premium_yearly',
              product: {
                title: 'Premium Yearly',
                description: 'Yearly subscription (was $47.99, now 50% off!)',
                price: 2399, // $23.99 in cents
                currencyCode: 'USD',
                wasPrice: 4799 // $47.99 in cents
              }
            },
            {
              identifier: 'premium_lifetime',
              product: {
                title: 'Premium Lifetime',
                description: 'One-time payment for lifetime access (was $95.99, now 50% off!)',
                price: 4799, // $47.99 in cents
                currencyCode: 'USD',
                wasPrice: 9599 // $95.99 in cents
              }
            }
          ]
        }
      };
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageInfo) {
    try {
      // Check if this is a lifetime subscription
      if (packageInfo.identifier === 'premium_lifetime') {
        // For lifetime, create a one-time payment instead of subscription
        const response = await axios.post('/api/create-lifetime-payment', {
          priceId: this.getStripePriceId(packageInfo.identifier)
        });
        return response.data;
      } else {
        // Use Stripe for recurring subscription payment processing
        const response = await axios.post('/api/create-subscription', {
          priceId: this.getStripePriceId(packageInfo.identifier)
        });
        return response.data;
      }
    } catch (error) {
      console.error('Failed to purchase package:', error);
      throw error;
    }
  }

  async restorePurchases() {
    try {
      const response = await axios.get('/api/subscription-status');
      return response.data;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  getStripePriceId(packageIdentifier) {
    // Map your package identifiers to Stripe Price IDs
    const priceMapping = {
      'premium_monthly': process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
      'premium_yearly': process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder',
      'premium_lifetime': process.env.REACT_APP_STRIPE_LIFETIME_PRICE_ID || 'price_lifetime_placeholder'
    };
    
    return priceMapping[packageIdentifier];
  }

  async checkSubscriptionStatus() {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      if (customerInfo.isSubscribed && customerInfo.subscription) {
        const subscription = customerInfo.subscription;
        return {
          isSubscribed: true,
          plan: subscription.plan.id,
          status: subscription.status,
          expirationDate: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd * 1000) : null,
          nextBillingDate: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd * 1000) : null,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
          isLifetime: subscription.plan.id === process.env.REACT_APP_STRIPE_LIFETIME_PRICE_ID
        };
      }
      
      return {
        isSubscribed: false,
        plan: null,
        status: 'inactive',
        expirationDate: null,
        nextBillingDate: null,
        cancelAtPeriodEnd: false,
        isLifetime: false
      };
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return {
        isSubscribed: false,
        plan: null,
        status: 'error',
        expirationDate: null,
        nextBillingDate: null,
        cancelAtPeriodEnd: false,
        isLifetime: false
      };
    }
  }

  async getSubscriptionPlans() {
    try {
      const offerings = await this.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        return [];
      }
      
      return currentOffering.availablePackages.map(pkg => ({
        id: pkg.identifier,
        title: pkg.product.title,
        description: pkg.product.description,
        price: pkg.product.price,
        currency: pkg.product.currencyCode,
        package: pkg,
        isLifetime: pkg.identifier === 'premium_lifetime'
      }));
    } catch (error) {
      console.error('Failed to get subscription plans:', error);
      return [];
    }
  }

  async cancelSubscription() {
    try {
      const response = await axios.post('/api/cancel-subscription');
      return response.data;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }
}

export default new SubscriptionService(); 