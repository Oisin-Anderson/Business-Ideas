// Example React component for Profile Screen with Subscription Info
// This shows how to use the new subscription date fields

import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubscriptionStatusDisplay = (status) => {
    switch (status) {
      case 'free': return { text: 'Free Plan', color: 'text-gray-600' };
      case 'premium': return { text: 'Premium Plan', color: 'text-blue-600' };
      case 'lifetime': return { text: 'Lifetime Access', color: 'text-gold-600' };
      default: return { text: 'Unknown', color: 'text-gray-600' };
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-red-500 p-8">Error loading profile</div>;
  }

  const statusDisplay = getSubscriptionStatusDisplay(user.subscription_status);
  const renewalDate = formatDate(user.subscription_renewal_date);
  const expiryDate = formatDate(user.subscription_expiry_date);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Member since:</span> {formatDate(user.created_at)}</p>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <div className="space-y-3">
          <p>
            <span className="font-medium">Current Plan:</span>{' '}
            <span className={statusDisplay.color + ' font-semibold'}>
              {statusDisplay.text}
            </span>
          </p>

          {/* Only show renewal date if it exists (recurring subscriptions) */}
          {renewalDate && user.subscription_status === 'premium' && (
            <p>
              <span className="font-medium">Next Renewal:</span>{' '}
              <span className="text-green-600">{renewalDate}</span>
            </p>
          )}

          {/* Only show expiry date if it exists (cancelled subscriptions) */}
          {expiryDate && (
            <p>
              <span className="font-medium">Expires on:</span>{' '}
              <span className="text-orange-600">{expiryDate}</span>
            </p>
          )}

          {/* Lifetime subscription message */}
          {user.subscription_status === 'lifetime' && (
            <p className="text-gold-600 font-medium">
              🎉 You have lifetime access - no expiration!
            </p>
          )}

          {/* Free plan upgrade message */}
          {user.subscription_status === 'free' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 mb-2">Upgrade to Premium for full access!</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
