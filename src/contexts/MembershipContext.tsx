// Premium Membership Context for Kumar Prescod Boxing
// Manages $4.99/month premium memberships with exclusive benefits

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsContext';
import { useAuth } from './AuthContext';

export interface PremiumBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface MembershipTier {
  id: 'free' | 'premium' | 'vip';
  name: string;
  price: number;
  duration: 'month' | 'year';
  description: string;
  benefits: PremiumBenefit[];
  popular?: boolean;
  color: string;
  gradient: string;
}

export interface PremiumContent {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'photo' | 'article' | 'live_session';
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  duration?: string;
  publishedAt: string;
  membershipRequired: 'free' | 'premium' | 'vip';
  exclusive: boolean;
}

export interface MembershipSubscription {
  id: string;
  userId: string;
  tier: 'premium' | 'vip';
  status: 'active' | 'cancelled' | 'past_due' | 'pending';
  startDate: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  paymentMethodId?: string;
  cancelledAt?: string;
  benefits: string[];
}

interface MembershipContextType {
  // Subscription Management
  currentSubscription: MembershipSubscription | null;
  availableTiers: MembershipTier[];
  subscribeToPremium: (tierId: string, paymentMethod: string) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
  updatePaymentMethod: (paymentMethodId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Content Access
  premiumContent: PremiumContent[];
  canAccessContent: (contentId: string) => boolean;
  getUserTier: () => 'free' | 'premium' | 'vip';
  getBenefits: () => PremiumBenefit[];
  
  // Premium Features
  hasEarlyTicketAccess: () => boolean;
  getPremiumDiscount: () => number;
  canAccessVIPContent: () => boolean;
  canJoinLiveSessions: () => boolean;
  
  // Analytics
  trackMembershipEvent: (action: string, tier?: string, value?: number) => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};

interface MembershipProviderProps {
  children: React.ReactNode;
}

export const MembershipProvider: React.FC<MembershipProviderProps> = ({ children }) => {
  const [currentSubscription, setCurrentSubscription] = useState<MembershipSubscription | null>(null);
  const [premiumContent, setPremiumContent] = useState<PremiumContent[]>([]);
  const { trackEvent } = useAnalytics();
  const { user, updateProfile } = useAuth();

  // Define membership tiers
  const availableTiers: MembershipTier[] = [
    {
      id: 'free',
      name: 'Free Fan',
      price: 0,
      duration: 'month',
      description: 'Basic access to Kumar\'s journey',
      color: 'gray',
      gradient: 'from-gray-500 to-gray-600',
      benefits: [
        {
          id: 'basic_content',
          title: 'Basic Content Access',
          description: 'Watch public training videos and fight highlights',
          icon: '📺',
          available: true
        },
        {
          id: 'newsletter',
          title: 'Fight Newsletter',
          description: 'Monthly newsletter with fight updates',
          icon: '📧',
          available: true
        },
        {
          id: 'social_access',
          title: 'Social Media Access',
          description: 'Follow Kumar on all social platforms',
          icon: '📱',
          available: true
        }
      ]
    },
    {
      id: 'premium',
      name: 'Premium Member',
      price: 4.99,
      duration: 'month',
      description: 'Exclusive access and premium benefits',
      popular: true,
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      benefits: [
        {
          id: 'premium_content',
          title: 'Exclusive Premium Content',
          description: 'Behind-the-scenes training videos, exclusive interviews',
          icon: '🎬',
          available: true
        },
        {
          id: 'early_tickets',
          title: 'Early Ticket Access',
          description: '48-hour early access to fight tickets',
          icon: '🎟️',
          available: true
        },
        {
          id: 'live_sessions',
          title: 'Monthly Live Q&A',
          description: 'Exclusive virtual Q&A sessions with Kumar',
          icon: '🎥',
          available: true
        },
        {
          id: 'premium_discount',
          title: 'Premium Discounts',
          description: '10% off merchandise and VIP packages',
          icon: '💰',
          available: true
        },
        {
          id: 'digital_autographs',
          title: 'Digital Autographs',
          description: 'Monthly digital autographed photos',
          icon: '✍️',
          available: true
        },
        {
          id: 'priority_support',
          title: 'Priority Support',
          description: 'Priority customer support for all inquiries',
          icon: '🚀',
          available: true
        }
      ]
    },
    {
      id: 'vip',
      name: 'VIP Champion',
      price: 19.99,
      duration: 'month',
      description: 'Ultimate fan experience with exclusive perks',
      color: 'gold',
      gradient: 'from-gold-500 to-gold-600',
      benefits: [
        {
          id: 'all_premium',
          title: 'All Premium Benefits',
          description: 'Everything from Premium tier included',
          icon: '⭐',
          available: true
        },
        {
          id: 'vip_tickets',
          title: 'VIP Ticket Packages',
          description: 'Exclusive access to VIP ticket packages with meet & greets',
          icon: '👑',
          available: true
        },
        {
          id: 'private_training',
          title: 'Training Session Access',
          description: 'Virtual viewing of private training sessions',
          icon: '🥊',
          available: true
        },
        {
          id: 'sponsor_path',
          title: 'Sponsor Upgrade Path',
          description: 'Direct upgrade path to sponsor packages',
          icon: '🤝',
          available: true
        }
      ]
    }
  ];

  // Mock premium content
  const mockPremiumContent: PremiumContent[] = [
    {
      id: 'training_exclusive_1',
      title: 'Behind the Scenes: Homecoming Prep',
      type: 'video',
      description: 'Exclusive footage of Kumar\'s preparation for the Oakland homecoming fight',
      thumbnailUrl: '/premium-content/training-prep-thumb.jpg',
      contentUrl: '/premium-content/training-prep-full.mp4',
      duration: '15:32',
      publishedAt: '2024-12-20T10:00:00Z',
      membershipRequired: 'premium',
      exclusive: true
    },
    {
      id: 'qa_session_1',
      title: 'December Live Q&A Session',
      type: 'live_session',
      description: 'Monthly premium member Q&A with Kumar',
      thumbnailUrl: '/premium-content/qa-session-thumb.jpg',
      contentUrl: '/premium-content/qa-session-recording.mp4',
      duration: '45:00',
      publishedAt: '2024-12-15T19:00:00Z',
      membershipRequired: 'premium',
      exclusive: true
    },
    {
      id: 'autograph_december',
      title: 'December Digital Autograph',
      type: 'photo',
      description: 'Exclusive digital autographed photo for premium members',
      thumbnailUrl: '/premium-content/autograph-december-thumb.jpg',
      contentUrl: '/premium-content/autograph-december-full.jpg',
      publishedAt: '2024-12-01T12:00:00Z',
      membershipRequired: 'premium',
      exclusive: true
    }
  ];

  useEffect(() => {
    // Initialize premium content
    setPremiumContent(mockPremiumContent);

    // Load user subscription if exists
    if (user) {
      loadUserSubscription(user.id);
    }
  }, [user]);

  const loadUserSubscription = async (userId: string) => {
    try {
      // Mock subscription data based on user's membership tier
      if (user?.membershipTier === 'premium') {
        const mockSubscription: MembershipSubscription = {
          id: `sub_${userId}`,
          userId: userId,
          tier: 'premium',
          status: 'active',
          startDate: '2024-01-01T00:00:00Z',
          nextBillingDate: '2025-01-01T00:00:00Z',
          amount: 4.99,
          currency: 'USD',
          benefits: ['premium_content', 'early_tickets', 'live_sessions', 'premium_discount', 'digital_autographs']
        };
        setCurrentSubscription(mockSubscription);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const subscribeToPremium = async (tierId: string, paymentMethod: string): Promise<{ success: boolean; error?: string }> => {
    try {
      trackMembershipEvent('Subscribe Intent', tierId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const tier = availableTiers.find(t => t.id === tierId);
      if (!tier) {
        return { success: false, error: 'Invalid membership tier' };
      }

      // Create new subscription
      const newSubscription: MembershipSubscription = {
        id: `sub_${user?.id}_${Date.now()}`,
        userId: user?.id || '',
        tier: tier.id as 'premium' | 'vip',
        status: 'active',
        startDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        amount: tier.price,
        currency: 'USD',
        paymentMethodId: paymentMethod,
        benefits: tier.benefits.map(b => b.id)
      };

      setCurrentSubscription(newSubscription);

      // Update user profile
      if (user) {
        await updateProfile({ membershipTier: tier.id as any });
      }

      trackMembershipEvent('Subscribe Success', tierId, tier.price);
      return { success: true };

    } catch (error) {
      trackMembershipEvent('Subscribe Failed', tierId);
      return { success: false, error: 'Subscription failed. Please try again.' };
    }
  };

  const cancelSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!currentSubscription) {
        return { success: false, error: 'No active subscription found' };
      }

      trackMembershipEvent('Cancel Intent', currentSubscription.tier);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedSubscription = {
        ...currentSubscription,
        status: 'cancelled' as const,
        cancelledAt: new Date().toISOString()
      };

      setCurrentSubscription(updatedSubscription);

      // Update user profile to basic
      if (user) {
        await updateProfile({ membershipTier: 'basic' });
      }

      trackMembershipEvent('Cancel Success', currentSubscription.tier);
      return { success: true };

    } catch (error) {
      trackMembershipEvent('Cancel Failed');
      return { success: false, error: 'Cancellation failed. Please try again.' };
    }
  };

  const updatePaymentMethod = async (paymentMethodId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!currentSubscription) {
        return { success: false, error: 'No active subscription found' };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedSubscription = {
        ...currentSubscription,
        paymentMethodId: paymentMethodId
      };

      setCurrentSubscription(updatedSubscription);
      trackMembershipEvent('Payment Method Updated', currentSubscription.tier);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update payment method' };
    }
  };

  const canAccessContent = (contentId: string): boolean => {
    const content = premiumContent.find(c => c.id === contentId);
    if (!content) return false;

    const userTier = getUserTier();
    
    if (content.membershipRequired === 'free') return true;
    if (content.membershipRequired === 'premium') return userTier === 'premium' || userTier === 'vip';
    if (content.membershipRequired === 'vip') return userTier === 'vip';
    
    return false;
  };

  const getUserTier = (): 'free' | 'premium' | 'vip' => {
    if (currentSubscription?.status === 'active') {
      return currentSubscription.tier;
    }
    return user?.membershipTier || 'free';
  };

  const getBenefits = (): PremiumBenefit[] => {
    const userTier = getUserTier();
    const tier = availableTiers.find(t => t.id === userTier);
    return tier?.benefits || [];
  };

  const hasEarlyTicketAccess = (): boolean => {
    const userTier = getUserTier();
    return userTier === 'premium' || userTier === 'vip';
  };

  const getPremiumDiscount = (): number => {
    const userTier = getUserTier();
    if (userTier === 'premium') return 10; // 10% discount
    if (userTier === 'vip') return 20; // 20% discount
    return 0;
  };

  const canAccessVIPContent = (): boolean => {
    return getUserTier() === 'vip';
  };

  const canJoinLiveSessions = (): boolean => {
    const userTier = getUserTier();
    return userTier === 'premium' || userTier === 'vip';
  };

  const trackMembershipEvent = (action: string, tier?: string, value?: number) => {
    trackEvent('Membership', action, tier, value);
  };

  const value: MembershipContextType = {
    currentSubscription,
    availableTiers,
    subscribeToPremium,
    cancelSubscription,
    updatePaymentMethod,
    premiumContent,
    canAccessContent,
    getUserTier,
    getBenefits,
    hasEarlyTicketAccess,
    getPremiumDiscount,
    canAccessVIPContent,
    canJoinLiveSessions,
    trackMembershipEvent,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
};

export default MembershipProvider;