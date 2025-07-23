import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Crown, Star, Gift, Calendar, Video, Percent, Users, Medal, Download, Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useFunding } from '../../contexts/FundingContext';
import PhotoGallery from '../../components/common/PhotoGallery';
import { getPublicPhotos, getMemberPhotos, getVipPhotos } from '../../utils/imageUtils';

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const { stats } = useFunding();
  
  // Get photos based on user access level
  const publicPhotos = getPublicPhotos();
  const memberPhotos = getMemberPhotos();
  const vipPhotos = getVipPhotos();
  
  const getAccessiblePhotos = () => {
    let photos = [...publicPhotos];
    if (user?.membershipTier === 'premium' || user?.membershipTier === 'vip') {
      photos = [...photos, ...memberPhotos];
    }
    if (user?.membershipTier === 'vip') {
      photos = [...photos, ...vipPhotos];
    }
    return photos;
  };

  useEffect(() => {
    trackEvent('Member', 'Dashboard View');
  }, [trackEvent]);

  const memberTierBenefits = {
    basic: {
      name: 'Basic Member',
      color: 'from-blue-500 to-blue-600',
      icon: Star,
      benefits: ['Monthly newsletter', 'Training updates', '10% merch discount']
    },
    premium: {
      name: 'Premium Supporter',
      color: 'from-purple-500 to-purple-600',
      icon: Crown,
      benefits: ['Weekly exclusive content', 'VIP event access', '20% merch discount', 'Private Q&A sessions']
    },
    vip: {
      name: 'VIP Champion',
      color: 'from-gold-500 to-gold-600',
      icon: Medal,
      benefits: ['Daily training footage', 'Meet & greet access', '30% merch discount', 'Personal video messages', 'Training camp visits']
    }
  };

  const currentTier = memberTierBenefits[user?.membershipTier || 'basic'];

  const exclusiveContent = [
    {
      id: 'training-session-1',
      title: 'Heavy Bag Training Session',
      type: 'video',
      duration: '15 min',
      thumbnail: '/images/exclusive/heavy-bag-session.jpg',
      description: 'Watch Kumar\'s complete heavy bag routine with technique breakdown',
      premium: false
    },
    {
      id: 'behind-scenes-camp',
      title: 'Behind the Scenes: Training Camp',
      type: 'video',
      duration: '25 min',
      thumbnail: '/images/exclusive/training-camp.jpg',
      description: 'Exclusive footage from Kumar\'s training camp preparation',
      premium: true
    },
    {
      id: 'diet-plan',
      title: 'Kumar\'s Championship Diet Plan',
      type: 'document',
      pages: 12,
      description: 'Complete nutrition guide used during fight preparation',
      premium: true
    },
    {
      id: 'workout-routine',
      title: 'Daily Workout Routine',
      type: 'document',
      pages: 8,
      description: 'Detailed workout plan with exercises and rep counts',
      premium: false
    },
    {
      id: 'meditation-session',
      title: 'Pre-Fight Meditation & Mental Prep',
      type: 'audio',
      duration: '20 min',
      description: 'Kumar\'s mental preparation techniques for big fights',
      premium: true
    }
  ];

  const upcomingEvents = [
    {
      id: 'vip-meet-greet',
      title: 'VIP Meet & Greet',
      date: '2024-02-15',
      time: '6:00 PM',
      location: 'Oakland Training Facility',
      type: 'vip-only',
      spots: 20,
      description: 'Exclusive meet and greet with Kumar, photos, and signed merchandise'
    },
    {
      id: 'q-and-a',
      title: 'Private Q&A Session',
      date: '2024-02-22',
      time: '7:00 PM',
      location: 'Virtual (Zoom)',
      type: 'premium',
      spots: 50,
      description: 'Ask Kumar your questions about boxing, training, and his journey'
    },
    {
      id: 'training-viewing',
      title: 'Training Session Viewing',
      date: '2024-03-01',
      time: '4:00 PM',
      location: 'Oakland Gym',
      type: 'all-members',
      spots: 100,
      description: 'Watch Kumar train and learn from his techniques'
    }
  ];

  const memberDiscounts = [
    {
      store: 'Official Merchandise',
      discount: user?.membershipTier === 'vip' ? 30 : user?.membershipTier === 'premium' ? 20 : 10,
      code: 'MEMBER' + (user?.membershipTier || 'BASIC').toUpperCase(),
      validUntil: '2024-12-31'
    },
    {
      store: 'Fight Tickets',
      discount: user?.membershipTier === 'vip' ? 25 : user?.membershipTier === 'premium' ? 15 : 5,
      code: 'TICKETS' + (user?.membershipTier || 'BASIC').toUpperCase(),
      validUntil: '2024-12-31'
    },
    {
      store: 'Training Gear Partners',
      discount: user?.membershipTier === 'vip' ? 20 : user?.membershipTier === 'premium' ? 15 : 10,
      code: 'GEAR' + (user?.membershipTier || 'BASIC').toUpperCase(),
      validUntil: '2024-12-31'
    }
  ];

  const handleContentAccess = (content: any) => {
    if (content.premium && user?.membershipTier === 'basic') {
      trackEvent('Member', 'Premium Content Blocked', content.title);
      return;
    }
    trackEvent('Member', 'Content Accessed', content.title);
  };

  const handleEventRegister = (event: any) => {
    trackEvent('Member', 'Event Registration', event.title);
  };

  const handleDiscountCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    trackEvent('Member', 'Discount Code Copied', code);
  };

  return (
    <>
      <Helmet>
        <title>Member Dashboard - Kumar Prescod Boxing</title>
        <meta name="description" content="Exclusive member content, discounts, and VIP access for Kumar Prescod supporters." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container-max py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <currentTier.icon className="w-8 h-8 mr-3" />
                    <span className="text-lg font-semibold opacity-90">{currentTier.name}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                  <p className="text-lg opacity-90">
                    Thank you for supporting Kumar's journey to championship glory.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${stats.totalRaised.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">Total Community Raised</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Member Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Gift className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold">Your Benefits</h3>
              </div>
              <ul className="space-y-2">
                {currentTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Star className="w-4 h-4 text-gold-500 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold">Member Since</h3>
              </div>
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {new Date(user?.joinDate || '').toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <p className="text-gray-600">
                Thank you for {Math.floor((Date.now() - new Date(user?.joinDate || '').getTime()) / (1000 * 60 * 60 * 24 * 30))} months of support!
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold">Community Impact</h3>
              </div>
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {stats.totalDonors}
              </div>
              <p className="text-gray-600">
                Total supporters like you making a difference
              </p>
            </div>
          </motion.div>

          {/* Exclusive Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Video className="w-6 h-6 mr-2 text-primary-600" />
              Exclusive Content
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exclusiveContent.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    content.premium && user?.membershipTier === 'basic' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
                      {content.type === 'video' && <Play className="w-12 h-12 text-white" />}
                      {content.type === 'document' && <Download className="w-12 h-12 text-white" />}
                      {content.type === 'audio' && <Video className="w-12 h-12 text-white" />}
                    </div>
                    {content.premium && (
                      <div className="absolute top-3 right-3 bg-gold-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        PREMIUM
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {content.duration || `${content.pages} pages`}
                      </span>
                      <button
                        onClick={() => handleContentAccess(content)}
                        disabled={content.premium && user?.membershipTier === 'basic'}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          content.premium && user?.membershipTier === 'basic'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                      >
                        {content.premium && user?.membershipTier === 'basic' ? 'Premium Only' : 'Access'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Exclusive Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-primary-600" />
              Exclusive Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">{event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.type === 'vip-only' 
                            ? 'bg-gold-100 text-gold-800'
                            : event.type === 'premium'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type === 'vip-only' ? 'VIP Only' : event.type === 'premium' ? 'Premium+' : 'All Members'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span>🕐 {event.time}</span>
                        <span>📍 {event.location}</span>
                        <span>👥 {event.spots} spots</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEventRegister(event)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Exclusive Photo Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Video className="w-6 h-6 mr-2 text-primary-600" />
              Exclusive Training Gallery
            </h2>
            <PhotoGallery 
              photos={getAccessiblePhotos().slice(0, 9)} 
              columns={3}
              showMetadata={true}
              enableLightbox={true}
              enableSharing={true}
              enableDownload={user?.membershipTier === 'vip'}
              className="mb-6"
            />
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {user?.membershipTier === 'basic' && 'Upgrade to Premium or VIP for access to exclusive training photos and behind-the-scenes content.'}
                {user?.membershipTier === 'premium' && 'Upgrade to VIP for access to personal moments and download privileges.'}
                {user?.membershipTier === 'vip' && 'Enjoy full access to all exclusive content including personal moments and download privileges.'}
              </p>
              {user?.membershipTier !== 'vip' && (
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Upgrade Membership
                </button>
              )}
            </div>
          </motion.div>

          {/* Member Discounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Percent className="w-6 h-6 mr-2 text-primary-600" />
              Member Discounts
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {memberDiscounts.map((discount, index) => (
                <motion.div
                  key={discount.store}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-md p-6 text-center"
                >
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {discount.discount}% OFF
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{discount.store}</h3>
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <code className="text-primary-600 font-mono font-semibold">
                      {discount.code}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Valid until {new Date(discount.validUntil).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDiscountCopy(discount.code)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full"
                  >
                    Copy Code
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upgrade CTA for Basic Members */}
          {user?.membershipTier === 'basic' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center"
            >
              <Crown className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Upgrade to Premium</h3>
              <p className="text-lg opacity-90 mb-6">
                Get access to exclusive content, VIP events, and bigger discounts
              </p>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;