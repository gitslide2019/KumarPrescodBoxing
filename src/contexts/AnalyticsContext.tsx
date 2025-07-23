
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
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider; 