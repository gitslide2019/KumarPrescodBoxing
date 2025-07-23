import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '../contexts/AnalyticsContext';

const TicketCheckout: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'TicketCheckout');
  }, [trackEvent]);

  return (
    <>
      <Helmet>
        <title>Buy Tickets - Kumar Prescod | Boxing Event Tickets</title>
        <meta name="description" content="Purchase tickets for Kumar Prescod's upcoming boxing events. Secure your seats for the next big fight." />
      </Helmet>

      <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
        <div className="container-max text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Buy <span className="gradient-text">Tickets</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Secure your seats for Kumar's upcoming fights.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <p className="text-lg text-secondary-700">
              This page will include ticket purchasing functionality and payment processing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketCheckout; 