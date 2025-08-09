import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Loader, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSubscription } from '../contexts/SubscriptionContext';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your-stripe-publishable-key');

// Debug Stripe configuration
console.log('🔍 Client Stripe Configuration Debug:');
console.log('   Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set');
console.log('   Monthly Price ID:', process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID || 'Not set');
console.log('   Yearly Price ID:', process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID || 'Not set');
console.log('   Lifetime Price ID:', process.env.REACT_APP_STRIPE_LIFETIME_PRICE_ID || 'Not set');
console.log();

// Fake Google reviews data
const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    text: "The business ideas are incredibly detailed and actionable. I started my online tutoring service using their step-by-step guide and it's been amazing!",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Michael R.",
    rating: 5,
    text: "Finally found a resource that doesn't just give vague ideas. Each business plan includes real implementation strategies and cost breakdowns.",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Jennifer L.",
    rating: 4,
    text: "The level of detail in these business ideas is impressive. I used their guidance to launch my pet grooming service and it's already profitable!",
    date: "3 weeks ago"
  }
];

const ReviewCarousel = () => {
  const [currentReview, setCurrentReview] = useState(0);

  // Auto-rotate reviews every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6 mb-6 relative">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
        What Our Users Say
      </h3>
      
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevReview}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-dark-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        
        <button
          onClick={nextReview}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-dark-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Reviews Container */}
        <div className="px-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`transition-all duration-500 ${
                index === currentReview
                  ? 'opacity-100 transform translate-x-0'
                  : 'opacity-0 absolute top-0 left-0 transform translate-x-full'
              }`}
            >
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center space-x-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                
                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                
                {/* Reviewer Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{review.name}</span>
                  <span className="mx-2">•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentReview
                  ? 'bg-primary-600 dark:bg-primary-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ selectedPlan, onSuccess, onClose, processing, setProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { purchaseSubscription } = useSubscription();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Purchase the subscription or lifetime payment
      const result = await purchaseSubscription(selectedPlan.package);
      
      if (result.success && result.clientSecret) {
        // Confirm the setup with Stripe
        const { error, setupIntent } = await stripe.confirmCardSetup(result.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        });

        if (error) {
          toast.error(error.message || 'Payment setup failed. Please try again.');
        } else if (setupIntent.status === 'succeeded') {
          const message = selectedPlan.isLifetime 
            ? 'Lifetime payment successful! You now have permanent access to all premium features.'
            : 'Payment setup successful! Your subscription is now active.';
          toast.success(message);
          onSuccess();
        }
      } else {
        toast.error('Failed to create payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 dark:border-dark-600 rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        {processing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{selectedPlan.isLifetime ? 'Complete Lifetime Purchase' : 'Complete Payment'}</span>
          </>
        )}
      </button>
    </form>
  );
};

const SubscriptionModal = ({ isOpen, onClose }) => {
  const { subscriptionPlans } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (subscriptionPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(subscriptionPlans[0]);
    }
  }, [subscriptionPlans, selectedPlan]);

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price / 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Get Full Access
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={processing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors relative ${
                selectedPlan?.id === plan.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
              }`}
              onClick={() => !processing && setSelectedPlan(plan)}
            >
              {/* Most Popular Badge for Yearly Plan */}
              {plan.id === 'premium_yearly' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    ⭐ Most Popular
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {plan.package.product.wasPrice && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(plan.package.product.wasPrice, plan.currency)}
                      </span>
                    )}
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(plan.price, plan.currency)}
                    </div>
                  </div>
                  {selectedPlan?.id === plan.id && (
                    <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 ml-auto mt-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Carousel */}
        <ReviewCarousel />

        {/* Payment Form */}
        {selectedPlan && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              selectedPlan={selectedPlan}
              onSuccess={onClose}
              onClose={onClose}
              processing={processing}
              setProcessing={setProcessing}
            />
          </Elements>
        )}

        {/* Cancel Button */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full btn-outline"
            disabled={processing}
          >
            Cancel
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          You can cancel your subscription at any time from your profile page.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionModal; 