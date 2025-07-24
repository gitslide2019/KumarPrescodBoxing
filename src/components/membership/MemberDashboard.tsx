import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Calendar, 
  PlayCircle, 
  Download, 
  Users, 
  Ticket, 
  Star,
  Clock,
  Lock,
  Gift,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useMembership } from '../../contexts/MembershipContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const MemberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'benefits' | 'settings'>('content');
  const { 
    currentSubscription, 
    premiumContent, 
    canAccessContent, 
    getUserTier, 
    getBenefits,
    hasEarlyTicketAccess,
    getPremiumDiscount,
    trackMembershipEvent 
  } = useMembership();
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  const userTier = getUserTier();
  const benefits = getBenefits();
  const accessibleContent = premiumContent.filter(content => canAccessContent(content.id));

  const handleContentClick = (contentId: string, contentTitle: string) => {
    trackMembershipEvent('Content Accessed', contentId);
    trackEvent('Premium Content', 'View', contentTitle);
  };

  const handleBenefitUse = (benefitType: string) => {
    trackMembershipEvent('Benefit Used', benefitType);
  };

  const tierConfig = {
    free: { 
      color: 'gray', 
      icon: Star, 
      gradient: 'from-gray-400 to-gray-500',
      name: 'Free Fan' 
    },
    premium: { 
      color: 'primary', 
      icon: Crown, 
      gradient: 'from-primary-500 to-primary-600',
      name: 'Premium Member' 
    },
    vip: { 
      color: 'gold', 
      icon: Crown, 
      gradient: 'from-gold-400 to-gold-500',
      name: 'VIP Champion' 
    }
  };

  const currentTierConfig = tierConfig[userTier];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-max py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
          <div className={`bg-gradient-to-r ${currentTierConfig.gradient} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <currentTierConfig.icon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                  <p className="text-lg opacity-90">{currentTierConfig.name}</p>
                </div>
              </div>
              
              {currentSubscription && (
                <div className="text-right">
                  <div className="text-sm opacity-80">Next billing</div>
                  <div className="font-semibold">
                    {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm opacity-80">
                    ${currentSubscription.amount}/{currentSubscription.currency === 'USD' ? 'month' : currentSubscription.currency}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{accessibleContent.length}</div>
                <div className="text-sm text-gray-600">Premium Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{getPremiumDiscount()}%</div>
                <div className="text-sm text-gray-600">Member Discount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {hasEarlyTicketAccess() ? '48h' : '0h'}
                </div>
                <div className="text-sm text-gray-600">Early Access</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{benefits.length}</div>
                <div className="text-sm text-gray-600">Active Benefits</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 p-2">
            {[
              { id: 'content', label: 'Premium Content', icon: PlayCircle },
              { id: 'benefits', label: 'Member Benefits', icon: Gift },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Premium Content</h2>
                <div className="text-sm text-gray-600">
                  {accessibleContent.length} items available
                </div>
              </div>

              {accessibleContent.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accessibleContent.map((content) => (
                    <motion.div
                      key={content.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer group"
                      onClick={() => handleContentClick(content.id, content.title)}
                    >
                      <div className="relative">
                        <img
                          src={content.thumbnailUrl}
                          alt={content.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            // Fallback to gradient background if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.style.background = 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white" />
                        </div>
                        {content.exclusive && (
                          <div className="absolute top-3 right-3 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Exclusive
                          </div>
                        )}
                        {content.duration && (
                          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                            {content.duration}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {content.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="capitalize">{content.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Premium Content Available</h3>
                  <p className="text-gray-600 mb-6">
                    {userTier === 'free' 
                      ? 'Upgrade to premium to access exclusive content' 
                      : 'New premium content will appear here soon'}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Your Member Benefits</h2>

              {/* Early Ticket Access */}
              {hasEarlyTicketAccess() && (
                <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl p-6 border border-primary-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Early Ticket Access</h3>
                      <p className="text-gray-700 mb-4">
                        Get 48-hour early access to Kumar's fight tickets before general public release.
                      </p>
                      <button
                        onClick={() => handleBenefitUse('early_ticket_access')}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View Available Tickets
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Discount */}
              {getPremiumDiscount() > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {getPremiumDiscount()}% Member Discount
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Save {getPremiumDiscount()}% on merchandise and VIP packages automatically at checkout.
                      </p>
                      <div className="text-sm text-green-700">
                        💰 Discount automatically applied to your purchases
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{benefit.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                        {benefit.available && (
                          <div className="mt-3 flex items-center text-green-600 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Active
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Membership Settings</h2>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
                
                {currentSubscription ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Plan</label>
                        <div className="text-lg font-semibold text-gray-900 capitalize">
                          {currentSubscription.tier} Membership
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className={`text-lg font-semibold capitalize ${
                          currentSubscription.status === 'active' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {currentSubscription.status}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Amount</label>
                        <div className="text-lg font-semibold text-gray-900">
                          ${currentSubscription.amount}/month
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Next Billing</label>
                        <div className="text-lg font-semibold text-gray-900">
                          {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Update Payment Method
                        </button>
                        <button className="px-6 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 mb-6">
                      Upgrade to premium to access exclusive content and benefits
                    </p>
                    <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;