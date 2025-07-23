import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '../contexts/AnalyticsContext';

const ShopCheckout: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'ShopCheckout');
  }, [trackEvent]);

  return (
    <>
      <Helmet>
        <title>Checkout - Kumar Prescod Store | Complete Your Purchase</title>
        <meta name="description" content="Complete your purchase of Kumar Prescod merchandise. Secure checkout with multiple payment options." />
      </Helmet>

      <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
        <div className="container-max text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Complete <span className="gradient-text">Purchase</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Secure checkout for your Kumar Prescod merchandise.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <p className="text-lg text-secondary-700">
              This page will include shopping cart, payment processing, and order confirmation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCheckout; 