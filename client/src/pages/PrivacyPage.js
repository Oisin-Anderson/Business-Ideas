import React from 'react';
import { Shield, Eye, Lock, Database, Users, Bell } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Last updated: March 15, 2025
          </p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We collect information you provide directly to us, such as when you create an account, 
                  subscribe to our service, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Name and email address</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Account preferences and settings</li>
                  <li>Communication history with our support team</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Usage Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We automatically collect certain information about your use of our service, including:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Pages visited and features used</li>
                  <li>Time spent on different sections</li>
                  <li>Device information and browser type</li>
                  <li>IP address and general location</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Provide, maintain, and improve our business ideas service</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send you important updates about our service</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Information Sharing
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our business (payment processing, hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Data Security
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure hosting infrastructure</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Rights
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Complaints:</strong> Lodge a complaint with relevant authorities</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Cookies and Tracking
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                You can control cookie settings through your browser preferences.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> oisin@oagames.xyz
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Updates to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date. Your continued use 
              of our service after any changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 