import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, CreditCard, Shield, ArrowRight, X } from 'lucide-react';
import { useMembership } from '../../contexts/MembershipContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface MembershipSubscriptionProps {
  onClose?: () => void;
  selectedTier?: 'premium' | 'vip';
}

const MembershipSubscription: React.FC<MembershipSubscriptionProps> = ({ 
  onClose, 
  selectedTier = 'premium' 
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(selectedTier);
  const [paymentMethod, setPaymentMethod] = useState('stripe_card');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { availableTiers, subscribeToPremium, trackMembershipEvent } = useMembership();
  const { user, isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();

  // Filter to show only premium tiers
  const premiumTiers = availableTiers.filter(tier => tier.id !== 'free');

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setError('Please log in to subscribe to premium membership');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await subscribeToPremium(selectedPlan, paymentMethod);
      
      if (result.success) {
        setSuccess(true);
        trackEvent('Membership', 'Subscribe Success', selectedPlan);
        
        // Close modal after success delay
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        setError(result.error || 'Subscription failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelect = (tierId: 'premium' | 'vip') => {
    setSelectedPlan(tierId);
    trackMembershipEvent('Tier Selected', tierId);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium!</h3>
          <p className="text-gray-600 mb-6">
            Your premium membership is now active. You'll receive an email confirmation shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Exploring Premium Content
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Join Premium</h2>
            <p className="text-gray-600 mt-2">
              Get exclusive access to Kumar's training content and premium benefits
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          )}
        </div>

        {/* Premium Benefits Overview */}
        <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Crown className="w-6 h-6 text-gold-500 mr-2" />
            Premium Member Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <span className="font-semibold">48-Hour Early Ticket Access</span>
                <p className="text-sm text-gray-600">Get tickets before general public</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <span className="font-semibold">Exclusive Training Content</span>
                <p className="text-sm text-gray-600">Behind-the-scenes videos & interviews</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <span className="font-semibold">Monthly Live Q&A Sessions</span>
                <p className="text-sm text-gray-600">Direct access to Kumar</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <span className="font-semibold">Premium Discounts</span>
                <p className="text-sm text-gray-600">10% off merchandise & VIP packages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {premiumTiers.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan === tier.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTierSelect(tier.id as 'premium' | 'vip')}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {tier.id === 'premium' ? (
                    <Star className="w-8 h-8 text-primary-500 mr-3" />
                  ) : (
                    <Crown className="w-8 h-8 text-gold-500 mr-3" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-gray-600 text-sm">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-gray-600 ml-2">/{tier.duration}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {tier.benefits.slice(0, 4).map((benefit) => (
                    <div key={benefit.id} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">{benefit.title}</span>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {tier.benefits.length > 4 && (
                    <div className="text-sm text-gray-500">
                      +{tier.benefits.length - 4} more benefits
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Method
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="stripe_card"
                checked={paymentMethod === 'stripe_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-primary-600"
              />
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="font-medium">Credit/Debit Card</span>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </div>
              <div className="ml-auto">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Secure Payment</h4>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and secure. Cancel anytime from your account settings.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Subscribe Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Start Premium Membership
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription will auto-renew monthly until cancelled.
        </p>
      </motion.div>
    </div>
  );
};

export default MembershipSubscription;