import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '../contexts/AnalyticsContext';

const Podcast: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'Podcast');
  }, [trackEvent]);

  return (
    <>
      <Helmet>
        <title>Podcast - Kumar Prescod | Boxing Talk & Interviews</title>
        <meta name="description" content="Listen to Kumar Prescod's podcast featuring boxing insights, interviews, and behind-the-scenes stories." />
      </Helmet>

      <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
        <div className="container-max text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            The <span className="gradient-text">Podcast</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Listen to Kumar's thoughts on boxing, life, and everything in between.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <p className="text-lg text-secondary-700">
              This page will feature podcast episodes, interviews, and audio content.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Podcast; 