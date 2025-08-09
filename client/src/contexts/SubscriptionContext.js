import React, { createContext, useContext, useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    plan: null,
    status: 'inactive',
    expirationDate: null,
    nextBillingDate: null,
    cancelAtPeriodEnd: false
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize subscription service when user changes
  useEffect(() => {
    const initializeSubscription = async () => {
      if (user) {
        try {
          await subscriptionService.initialize(user.id);
          await loadSubscriptionData();
        } catch (error) {
          console.error('Failed to initialize subscription:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeSubscription();
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      const [status, plans] = await Promise.all([
        subscriptionService.checkSubscriptionStatus(),
        subscriptionService.getSubscriptionPlans()
      ]);
      
      setSubscriptionStatus(status);
      setSubscriptionPlans(plans);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    }
  };

  const purchaseSubscription = async (packageToPurchase) => {
    try {
      setLoading(true);
      const result = await subscriptionService.purchasePackage(packageToPurchase);
      
      // Update subscription status
      await loadSubscriptionData();
      
      toast.success('Subscription purchased successfully!');
      return { success: true, clientSecret: result.clientSecret };
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      toast.error('Failed to purchase subscription. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setLoading(true);
      const customerInfo = await subscriptionService.restorePurchases();
      
      // Update subscription status
      await loadSubscriptionData();
      
      if (customerInfo.isSubscribed) {
        toast.success('Purchases restored successfully!');
      } else {
        toast.error('No active purchases found to restore.');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      toast.error('Failed to restore purchases. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionService.cancelSubscription();
      
      // Update subscription status
      await loadSubscriptionData();
      
      toast.success('Subscription will be cancelled at the end of the current period.');
      return { success: true };
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      await loadSubscriptionData();
    } catch (error) {
      console.error('Failed to refresh subscription status:', error);
    }
  };

  const value = {
    subscriptionStatus,
    subscriptionPlans,
    loading,
    purchaseSubscription,
    restorePurchases,
    cancelSubscription,
    refreshSubscriptionStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 