import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Calendar, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const HeroSection: React.FC = () => {
  const { trackEvent } = useAnalytics();

  const handleCTAClick = (ctaType: string) => {
    trackEvent('Hero', 'CTA Click', ctaType);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Homecoming Fight Background with Promotion Photos */}
      <div className="absolute inset-0 z-[-3]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10s] ease-out"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(220, 38, 38, 0.6) 50%, rgba(15, 23, 42, 0.8) 100%), url('/fights/2025-08-16-oakland/IMG_5882.jpg')`
          }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 animate-pulse-slow"
          style={{
            backgroundImage: `url('/fights/2025-08-16-oakland/IMG_7202.jpeg')`
          }}
        />
      </div>

      {/* Dynamic overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-[-2]" />
      
      {/* Animated boxing ring elements */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-gold-400/30 rounded-full animate-bounce-slow" />
        <div className="absolute bottom-20 right-20 w-16 h-16 border-4 border-primary-500/40 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-10 w-12 h-12 bg-gradient-to-r from-primary-600/20 to-gold-500/20 rounded-full animate-float" />
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
            <span className="text-gold-200 text-sm font-bold tracking-wider uppercase">
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
            <span className="text-white drop-shadow-2xl">Kumar</span>
            <br />
            <span className="gradient-text text-shadow-lg">"The Raw One"</span>
            <br />
            <span className="text-white drop-shadow-2xl">Prescod</span>
          </motion.h1>

          {/* Homecoming Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gold-200 mb-4 max-w-4xl mx-auto leading-relaxed font-semibold"
          >
            From the streets of Oakland to the world stage — The Raw One returns home for the biggest fight of his career
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-white/80 mb-10 max-w-3xl mx-auto"
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
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gold-400/30">
              <div className="text-4xl md:text-5xl font-black text-gold-400 mb-2">3-0</div>
              <div className="text-sm font-semibold text-white/90 tracking-wider uppercase">Professional Record</div>
            </div>
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-primary-500/30">
              <div className="text-4xl md:text-5xl font-black text-primary-400 mb-2">100%</div>
              <div className="text-sm font-semibold text-white/90 tracking-wider uppercase">KO Rate</div>
            </div>
            <div className="text-center bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gold-400/30">
              <div className="text-4xl md:text-5xl font-black text-gold-400 mb-2">9x</div>
              <div className="text-sm font-semibold text-white/90 tracking-wider uppercase">National Champion</div>
            </div>
          </motion.div>

          {/* Championship CTA Buttons with Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col lg:flex-row gap-6 justify-center items-center"
          >
            <a
              href="/fights/tickets/KumarPrescod8:16 Tickets.html"
              className="btn-champion flex items-center group"
              onClick={() => handleCTAClick('Buy Homecoming Tickets')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Get Homecoming Tickets
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </a>
            
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