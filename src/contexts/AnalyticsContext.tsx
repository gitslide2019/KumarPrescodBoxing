
import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

interface AnalyticsContextType {
  trackEvent: (category: string, action: string, label?: string, value?: number) => void;
  trackPageView: (page: string) => void;
  trackPurchase: (value: number, currency: string, items: any[]) => void;
  trackAddToCart: (item: any) => void;
  trackSocialShare: (platform: string, content: string) => void;
  trackVideoPlay: (videoTitle: string) => void;
  trackPodcastPlay: (episodeTitle: string) => void;
  trackTicketPurchase: (eventName: string, ticketType: string, price: number) => void;
  trackSponsorInquiry: (packageName: string) => void;
  trackDonation: (amount: number, goalId: string, goalTitle: string) => void;
  trackFundingGoalView: (goalId: string, goalTitle: string) => void;
  trackCommunityEvent: (eventType: string, eventTitle: string, action: string) => void;
  trackVolunteerInterest: (eventId: string, eventTitle: string) => void;
  // Enhanced ticket purchase tracking
  trackTicketPurchaseIntent: (source: string, ticketType: string, price: number, membershipTier?: string) => void;
  trackTicketPurchaseComplete: (orderId: string, amount: number, ticketType: string, source: string) => void;
  trackTicketPurchaseSource: (source: string, component: string, page: string) => void;
  trackTicketPurchaseFunnel: (step: string, source: string, membershipTier?: string) => void;
  generateUTMParameters: (source: string, medium: string, campaign: string) => string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize analytics
    if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);
      setIsInitialized(true);
    }
  }, []);

  const trackEvent = (category: string, action: string, label?: string, value?: number) => {
    if (isInitialized) {
      ReactGA.event({
        category,
        action,
        label,
        value,
      });
    }
  };

  const trackPageView = (page: string) => {
    if (isInitialized) {
      ReactGA.send({ hitType: "pageview", page });
    }
  };

  const trackPurchase = (value: number, currency: string, _items: any[]) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Ecommerce',
        action: 'Purchase',
        value: value,
        label: `${currency} Purchase`
      });
    }
  };

  const trackAddToCart = (item: any) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Ecommerce',
        action: 'Add to Cart',
        label: item.name,
        value: item.price,
      });
    }
  };

  const trackSocialShare = (platform: string, content: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Social',
        action: 'Share',
        label: `${platform}: ${content}`,
      });
    }
  };

  const trackVideoPlay = (videoTitle: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Video',
        action: 'Play',
        label: videoTitle,
      });
    }
  };

  const trackPodcastPlay = (episodeTitle: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Podcast',
        action: 'Play',
        label: episodeTitle,
      });
    }
  };

  const trackTicketPurchase = (eventName: string, ticketType: string, price: number) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Tickets',
        action: 'Purchase',
        label: `${eventName} - ${ticketType}`,
        value: price,
      });
    }
  };

  const trackSponsorInquiry = (packageName: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Sponsorship',
        action: 'Inquiry',
        label: packageName,
      });
    }
  };

  const trackDonation = (amount: number, goalId: string, goalTitle: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Funding',
        action: 'Donation',
        label: `${goalTitle} (${goalId})`,
        value: amount,
      });
    }
  };

  const trackFundingGoalView = (goalId: string, goalTitle: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Funding',
        action: 'Goal View',
        label: `${goalTitle} (${goalId})`,
      });
    }
  };

  const trackCommunityEvent = (eventType: string, eventTitle: string, action: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Community',
        action: action,
        label: `${eventType}: ${eventTitle}`,
      });
    }
  };

  const trackVolunteerInterest = (eventId: string, eventTitle: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Community',
        action: 'Volunteer Interest',
        label: `${eventTitle} (${eventId})`,
      });
    }
  };

  // Enhanced ticket purchase tracking methods
  const trackTicketPurchaseIntent = (source: string, ticketType: string, price: number, membershipTier?: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Tickets',
        action: 'Purchase Intent',
        label: `${source} - ${ticketType}${membershipTier ? ` - ${membershipTier}` : ''}`,
        value: price,
        custom_parameters: {
          source: source,
          ticket_type: ticketType,
          membership_tier: membershipTier || 'none',
          intent_timestamp: new Date().toISOString()
        }
      });
    }
  };

  const trackTicketPurchaseComplete = (orderId: string, amount: number, ticketType: string, source: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Tickets',
        action: 'Purchase Complete',
        label: `${source} - ${ticketType} - Order: ${orderId}`,
        value: amount,
        custom_parameters: {
          order_id: orderId,
          source: source,
          ticket_type: ticketType,
          completion_timestamp: new Date().toISOString()
        }
      });
      
      // Also track as ecommerce purchase
      ReactGA.event({
        category: 'Ecommerce',
        action: 'Purchase',
        value: amount,
        label: `Ticket Purchase - ${ticketType}`
      });
    }
  };

  const trackTicketPurchaseSource = (source: string, component: string, page: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Tickets',
        action: 'Source Click',
        label: `${page}/${component}/${source}`,
        custom_parameters: {
          source: source,
          component: component,
          page: page,
          click_timestamp: new Date().toISOString()
        }
      });
    }
  };

  const trackTicketPurchaseFunnel = (step: string, source: string, membershipTier?: string) => {
    if (isInitialized) {
      ReactGA.event({
        category: 'Tickets',
        action: 'Funnel Step',
        label: `${step} - ${source}${membershipTier ? ` - ${membershipTier}` : ''}`,
        custom_parameters: {
          funnel_step: step,
          source: source,
          membership_tier: membershipTier || 'none',
          step_timestamp: new Date().toISOString()
        }
      });
    }
  };

  const generateUTMParameters = (source: string, medium: string, campaign: string) => {
    const params = new URLSearchParams({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
      utm_content: 'kumar_prescod_boxing',
      utm_term: new Date().toISOString().split('T')[0] // Date stamp
    });
    return params.toString();
  };

  const value: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackAddToCart,
    trackSocialShare,
    trackVideoPlay,
    trackPodcastPlay,
    trackTicketPurchase,
    trackSponsorInquiry,
    trackDonation,
    trackFundingGoalView,
    trackCommunityEvent,
    trackVolunteerInterest,
    trackTicketPurchaseIntent,
    trackTicketPurchaseComplete,
    trackTicketPurchaseSource,
    trackTicketPurchaseFunnel,
    generateUTMParameters,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider; 