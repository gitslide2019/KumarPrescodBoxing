import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, Shield, CreditCard } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  generateTrackedPayPalUrl, 
  trackTicketIntent, 
  TICKET_SOURCES, 
  TICKET_TYPES, 
  COMPONENTS, 
  PAGES,
  type TicketTrackingData 
} from '../utils/ticketTracking';

const TicketCheckout: React.FC = () => {
  const { 
    trackEvent, 
    trackTicketPurchaseIntent, 
    trackTicketPurchaseSource, 
    trackTicketPurchaseFunnel 
  } = useAnalytics();
  const { user } = useAuth();

  useEffect(() => {
    trackEvent('Page', 'View', 'TicketCheckout');
    
    // Create tracking data for auto-redirect
    const trackingData: TicketTrackingData = {
      source: TICKET_SOURCES.TICKET_CHECKOUT,
      component: COMPONENTS.TICKET_CHECKOUT,
      page: PAGES.CHECKOUT,
      ticketType: TICKET_TYPES.GENERAL,
      price: 105,
      membershipTier: user?.membershipTier
    };

    // Track funnel step for reaching checkout page
    trackTicketPurchaseFunnel('checkout_page_view', TICKET_SOURCES.TICKET_CHECKOUT, user?.membershipTier);
    
    // Auto-redirect to PayPal after 3 seconds
    const redirectTimer = setTimeout(() => {
      const trackedUrl = generateTrackedPayPalUrl(trackingData);
      
      // Track the auto-redirect
      trackTicketPurchaseFunnel('auto_redirect', TICKET_SOURCES.TICKET_CHECKOUT, user?.membershipTier);
      
      window.location.href = trackedUrl;
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [trackEvent, trackTicketPurchaseFunnel, user]);

  const handleManualTicketClick = () => {
    const trackingData: TicketTrackingData = {
      source: TICKET_SOURCES.TICKET_CHECKOUT,
      component: COMPONENTS.TICKET_CHECKOUT,
      page: PAGES.CHECKOUT,
      ticketType: TICKET_TYPES.GENERAL,
      price: 105,
      membershipTier: user?.membershipTier
    };

    // Track the manual click
    trackTicketIntent(trackingData, {
      trackTicketPurchaseIntent,
      trackTicketPurchaseSource,
      trackTicketPurchaseFunnel
    });

    // Also track legacy event for backwards compatibility
    trackEvent('Ticket', 'Click', 'PayPal Direct');

    // Generate tracked PayPal URL and navigate
    const trackedUrl = generateTrackedPayPalUrl(trackingData);
    window.location.href = trackedUrl;
  };

  return (
    <>
      <Helmet>
        <title>Buy Tickets - Kumar Prescod | Boxing Event Tickets</title>
        <meta name="description" content="Purchase tickets for Kumar Prescod's upcoming boxing events. Secure your seats for the next big fight." />
      </Helmet>

      <div className="pt-20 pb-16 bg-gradient-to-br from-slate-900 via-gray-900 to-black min-h-screen">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🥊 Redirecting to <span className="text-red-500">PayPal</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Securing your tickets for Kumar Prescod's Oakland homecoming fight...
          </p>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-green-400" />
              <span className="text-lg font-semibold text-white">Secure PayPal Checkout</span>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center justify-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span>Secure payment processing through PayPal</span>
              </div>
              <div className="text-sm">
                Tickets: $105 - $255 • August 16, 2025 • Oakland, CA
              </div>
            </div>
            
            <div className="mt-8">
              <button
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                onClick={handleManualTicketClick}
              >
                <ExternalLink className="w-5 h-5" />
                <span>Continue to PayPal</span>
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketCheckout; 