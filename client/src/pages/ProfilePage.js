import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, CreditCard, Shield, Settings, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import SubscriptionModal from '../components/SubscriptionModal';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { subscriptionStatus, loading, restorePurchases, refreshSubscriptionStatus } = useSubscription();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Successfully logged out');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleRestorePurchases = async () => {
    await restorePurchases();
  };

  const handleRefreshStatus = async () => {
    await refreshSubscriptionStatus();
    toast.success('Subscription status refreshed');
  };

  const getSubscriptionStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'expired':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSubscriptionStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'cancelled':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your account and subscription
          </p>
        </div>

        {/* Mobile: Stack everything vertically, Desktop: Grid layout */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(user?.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Status Card */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Subscription Status
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getSubscriptionStatusIcon(subscriptionStatus.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {subscriptionStatus.isSubscribed 
                          ? (subscriptionStatus.isLifetime ? 'Premium Lifetime' : 'Premium Plan')
                          : 'Free Plan'
                        }
                      </p>
                      <p className={`text-sm ${getSubscriptionStatusColor(subscriptionStatus.status)}`}>
                        {subscriptionStatus.isLifetime 
                          ? 'Lifetime Access' 
                          : subscriptionStatus.status === 'active' ? 'Active' : 
                           subscriptionStatus.status === 'cancelled' ? 'Cancelled' :
                           subscriptionStatus.status === 'expired' ? 'Expired' : 'Inactive'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleRefreshStatus}
                      disabled={loading}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      title="Refresh subscription status"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    {!subscriptionStatus.isSubscribed && (
                      <button 
                        onClick={() => setShowSubscriptionModal(true)}
                        className="btn-primary"
                      >
                        Get Full Access
                      </button>
                    )}
                  </div>
                </div>

                {subscriptionStatus.isSubscribed && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Plan
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {subscriptionStatus.isLifetime ? 'Premium Lifetime' : (subscriptionStatus.plan || 'Premium')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {subscriptionStatus.isLifetime ? 'Access Type' : 'Next Renewal'}
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {subscriptionStatus.isLifetime 
                          ? 'Permanent Access' 
                          : subscriptionStatus.nextBillingDate ? (
                            <>
                              {new Date(subscriptionStatus.nextBillingDate).toLocaleDateString()}
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                ({Math.ceil((new Date(subscriptionStatus.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days)
                              </span>
                            </>
                          ) : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Restore Purchases Button */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
                  <button
                    onClick={handleRestorePurchases}
                    disabled={loading}
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Restore Purchases</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop-only Account Actions - Hidden on mobile */}
            <div className="hidden md:block card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Actions
                </h3>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Saved Ideas</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Days Active</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Benefits */}
            {!subscriptionStatus.isSubscribed && (
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700">
                <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">
                  Get Full Access
                </h3>
                <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>Unlimited access to all business ideas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>Detailed implementation guides</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>Advanced analytics and insights</span>
                  </li>
                </ul>
                                 <button 
                   onClick={() => setShowSubscriptionModal(true)}
                   className="w-full btn-primary mt-4"
                 >
                   Get Full Access
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only Account Actions - Shown at bottom on mobile */}
        <div className="md:hidden mt-8">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Actions
              </h3>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Logout
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout? You'll be redirected to the homepage.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 btn-primary bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default ProfilePage; 