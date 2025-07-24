import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Calendar, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  generateTrackedPayPalUrl, 
  trackTicketIntent, 
  TICKET_SOURCES, 
  TICKET_TYPES, 
  COMPONENTS, 
  PAGES,
  type TicketTrackingData 
} from '../../utils/ticketTracking';

const HeroSection: React.FC = () => {
  const { 
    trackEvent, 
    trackTicketPurchaseIntent, 
    trackTicketPurchaseSource, 
    trackTicketPurchaseFunnel 
  } = useAnalytics();
  const { user } = useAuth();

  const handleCTAClick = (ctaType: string) => {
    trackEvent('Hero', 'CTA Click', ctaType);
  };

  const handleTicketClick = () => {
    const trackingData: TicketTrackingData = {
      source: TICKET_SOURCES.HERO_SECTION,
      component: COMPONENTS.HERO_SECTION,
      page: PAGES.HOME,
      ticketType: TICKET_TYPES.GENERAL,
      price: 105,
      membershipTier: user?.membershipTier
    };

    // Track the ticket purchase intent
    trackTicketIntent(trackingData, {
      trackTicketPurchaseIntent,
      trackTicketPurchaseSource,
      trackTicketPurchaseFunnel
    });

    // Also track legacy event for backwards compatibility
    handleCTAClick('Buy Homecoming Tickets');

    // Generate tracked PayPal URL
    const trackedUrl = generateTrackedPayPalUrl(trackingData);
    window.open(trackedUrl, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background with Enhanced Readability */}
      <div className="absolute inset-0 z-[-3]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/fights/2025-08-16-oakland/IMG_5882.jpg')`
          }}
        />
      </div>

      {/* Strong overlay for maximum text readability */}
      <div className="absolute inset-0 overlay-text z-[-2]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 z-[-1]" />
      
      {/* Subtle boxing ring element */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-gold-400/40 rounded-full animate-subtle" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Homecoming Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600/90 to-gold-500/90 backdrop-blur-sm rounded-full border border-gold-400/50 mb-8"
          >
            <span className="text-gold-high-contrast text-sm font-bold tracking-wider uppercase">
              🏠 Straight Outta Oakland Homecoming • August 16th
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-9xl font-black mb-6 leading-tight"
          >
            <span className="text-high-contrast">Kumar</span>
            <br />
            <span className="text-primary-high-contrast">"The Raw One"</span>
            <br />
            <span className="text-high-contrast">Prescod</span>
          </motion.h1>

          {/* Homecoming Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gold-high-contrast mb-4 max-w-4xl mx-auto leading-relaxed font-semibold"
          >
            From the streets of Oakland to the world stage — The Raw One returns home for the biggest fight of his career
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-high-contrast mb-10 max-w-3xl mx-auto"
          >
            18-year-old boxing prodigy • 9 National Amateur Titles • Perfect 3-0 Professional Record with all KOs
          </motion.p>

          {/* Championship Stats with Boxing Theme */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="text-center overlay-strong backdrop-blur-sm rounded-xl p-6 border border-gold-400/50">
              <div className="text-4xl md:text-5xl font-black text-gold-high-contrast mb-2">3-0</div>
              <div className="text-sm font-semibold text-high-contrast tracking-wider uppercase">Professional Record</div>
            </div>
            <div className="text-center overlay-strong backdrop-blur-sm rounded-xl p-6 border border-primary-500/50">
              <div className="text-4xl md:text-5xl font-black text-primary-high-contrast mb-2">100%</div>
              <div className="text-sm font-semibold text-high-contrast tracking-wider uppercase">KO Rate</div>
            </div>
            <div className="text-center overlay-strong backdrop-blur-sm rounded-xl p-6 border border-gold-400/50">
              <div className="text-4xl md:text-5xl font-black text-gold-high-contrast mb-2">9x</div>
              <div className="text-sm font-semibold text-high-contrast tracking-wider uppercase">National Champion</div>
            </div>
          </motion.div>

          {/* Championship CTA Buttons with Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col lg:flex-row gap-6 justify-center items-center"
          >
            <button
              className="btn-champion flex items-center group"
              onClick={handleTicketClick}
            >
              <Calendar className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Get Homecoming Tickets
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/journey"
                className="btn-secondary flex items-center"
                onClick={() => handleCTAClick('Watch Story')}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Story
              </Link>
              
              <div className="flex items-center space-x-3 text-white/90 bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <span className="text-sm font-semibold">Tickets from</span>
                <span className="text-2xl font-black text-gold-400">$105</span>
              </div>
            </div>
          </motion.div>

          {/* Fight Details Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/80"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gold-400" />
              <span className="font-semibold">Aug 16, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span className="font-semibold">Oakland Marriott City Center</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-primary-400 font-bold">LIVE</span>
              <span className="font-semibold">FOX Sports</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;