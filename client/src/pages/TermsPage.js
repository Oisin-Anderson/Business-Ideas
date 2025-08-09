import React from 'react';
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our Business Ideas service.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Last updated: March 15, 2025
          </p>
        </div>

        <div className="card p-8 space-y-8">
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Acceptance of Terms
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                By accessing and using Business Ideas Database ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Description of Service
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Business Ideas Database provides:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Curated business ideas and opportunities</li>
                <li>Detailed analysis and market insights</li>
                <li>Implementation guides and resources</li>
                <li>Investment requirement estimates</li>
                <li>Premium subscription features for detailed access</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Scale className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                User Accounts
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                When you create an account with us, you must provide accurate, complete, and current information. 
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Account Security
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      You agree not to disclose your password to any third party and to take sole responsibility 
                      for any activities or actions under your account, whether or not you have authorized such activities or actions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Subscription and Payment Terms
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Subscription Plans
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We offer various subscription plans including monthly, yearly, and lifetime access. 
                  All subscriptions are billed in advance and automatically renew unless cancelled.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Payments are processed securely through Stripe. By providing payment information, 
                  you authorize us to charge the applicable fees to your payment method.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cancellation and Refunds
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>You may cancel your subscription at any time through your account settings</li>
                  <li>Access continues until the end of your current billing period</li>
                  <li>30-day money-back guarantee for new subscriptions</li>
                  <li>No refunds for partial months or unused periods</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Acceptable Use Policy
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware or harmful code</li>
                <li>Engage in any form of harassment or abuse</li>
                <li>Resell or redistribute our content without permission</li>
                <li>Use automated tools to scrape or extract data</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Intellectual Property Rights
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Business Ideas Database and its licensors.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                You may use the business ideas and content for personal or commercial purposes, but you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Claim ownership of our content</li>
                <li>Remove copyright or proprietary notices</li>
                <li>Use our trademarks without permission</li>
                <li>Create derivative works for commercial distribution</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Disclaimers
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Business Ideas Disclaimer:</strong> The business ideas and information provided are for educational and informational purposes only. 
                  We do not guarantee the success of any business venture. Success depends on various factors including market conditions, 
                  execution, and individual circumstances.
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                The Service is provided "as is" without warranties of any kind, either express or implied. 
                We disclaim all warranties, including but not limited to warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              In no event shall Business Ideas Database, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
              resulting from your use of the Service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Termination
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We may terminate or suspend your account and bar access to the Service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever, 
                including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Upon termination, your right to use the Service will cease immediately. 
                If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              These Terms shall be interpreted and governed by the laws of the United States, 
              without regard to its conflict of law provisions. Our failure to enforce any right or provision 
              of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. 
              What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> oisin@oagames.xyz
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 