import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Instagram, Twitter, Youtube } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useFunding } from '../contexts/FundingContext';
import HeroSection from '../components/sections/HeroSection';
import UpcomingFights from '../components/sections/UpcomingFights';
import LatestNews from '../components/sections/LatestNews';
import StatsSection from '../components/sections/StatsSection';
import SocialFeed from '../components/sections/SocialFeed';
import FundingMeter from '../components/funding/FundingMeter';
import CommunityImpact from '../components/community/CommunityImpact';
import PhotoGallery from '../components/common/PhotoGallery';
import HomecomingFight from '../components/fights/HomecomingFight';
import { getFeaturedPhotos } from '../utils/imageUtils';

const Home: React.FC = () => {
  const { trackEvent } = useAnalytics();
  const { getActiveGoals } = useFunding();
  const activeGoals = getActiveGoals();
  const featuredPhotos = getFeaturedPhotos();

  useEffect(() => {
    trackEvent('Page', 'View', 'Home');
  }, [trackEvent]);

  const handleCTAClick = (ctaType: string) => {
    trackEvent('CTA', 'Click', ctaType);
  };

  return (
    <>
      <Helmet>
        <title>Kumar Prescod - Professional Boxer | Oakland, CA</title>
        <meta name="description" content="Follow the journey of Kumar Prescod, 18-year-old professional boxer from Oakland, CA. Buy tickets, merchandise, and stay updated with latest fights and news." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Homecoming Fight - Championship Section */}
      <section className="section-padding bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Boxing ring background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 border-4 border-primary-600 rounded-full animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-gold-500 rounded-full animate-bounce-slow" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-primary-600/20 to-gold-500/20 rounded-full animate-float" />
        </div>
        
        <div className="container-max relative z-10">
          <div className="text-center mb-16">
            {/* Championship Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600/10 to-gold-500/10 backdrop-blur-sm rounded-full border border-gold-400/30 mb-8"
            >
              <span className="text-gold-300 text-sm font-bold tracking-wider uppercase">
                🏠 Straight Outta Oakland • Championship Homecoming
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-black text-white mb-6"
            >
              <span className="gradient-text">Homecoming</span> Fight
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-gold-200 max-w-4xl mx-auto font-semibold mb-4"
            >
              The Raw One returns to his hometown Oakland for the biggest fight of his young career
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 max-w-3xl mx-auto"
            >
              August 16th • Oakland Marriott City Center • Live on FOX Sports
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="championship-border bg-slate-800 p-2 rounded-2xl"
          >
            <HomecomingFight variant="featured" />
          </motion.div>
        </div>
      </section>

      {/* Upcoming Fights */}
      <section className="section-padding bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Upcoming <span className="gradient-text">Fights</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gold-200 max-w-3xl mx-auto"
            >
              Don't miss the next chapter in Kumar's boxing journey. Get your tickets now and witness history in the making.
            </motion.p>
          </div>
          <UpcomingFights />
        </div>
      </section>

      {/* Latest News */}
      <section className="section-padding bg-gradient-to-b from-slate-800 to-gray-900">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Latest <span className="gradient-text">News</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gold-200 max-w-3xl mx-auto"
            >
              Stay updated with the latest news, interviews, and behind-the-scenes content from Kumar's boxing career.
            </motion.p>
          </div>
          <LatestNews />
        </div>
      </section>

      {/* Funding Section */}
      <section className="section-padding bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Support Kumar's <span className="gradient-text">Journey</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gold-200 max-w-3xl mx-auto"
            >
              Help Kumar reach his championship goals. Every contribution makes a difference in his training, equipment, and journey to greatness.
            </motion.p>
          </div>
          
          {activeGoals.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
              {activeGoals.slice(0, 2).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <FundingMeter
                    title={goal.title}
                    currentAmount={goal.currentAmount}
                    targetAmount={goal.targetAmount}
                    donorCount={goal.donorCount}
                    description={goal.description}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <Link
              to="/sponsors"
              className="btn-outline"
              onClick={() => handleCTAClick('View All Funding')}
            >
              View All Funding Goals
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Fight Promotion Gallery */}
      <section className="section-padding bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Fight <span className="gradient-text">Promotion</span> Gallery
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gold-200 max-w-3xl mx-auto"
            >
              Official promotion photos from the "Straight Outta Oakland" homecoming fight campaign.
            </motion.p>
          </div>
          
          {/* Promotion Photos Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <motion.div 
              className="card group cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/fights/2025-08-16-oakland/IMG_5882.jpg" 
                alt="Kumar Prescod Fight Promotion Photo 1" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-lg">Official Promotion Photo</p>
                  <p className="text-gold-300 text-sm">Straight Outta Oakland Campaign</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card group cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/fights/2025-08-16-oakland/IMG_7202.jpeg" 
                alt="Kumar Prescod Fight Promotion Photo 2" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-lg">Championship Portrait</p>
                  <p className="text-gold-300 text-sm">G1 & Lion's Den Promotions</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Training Gallery */}
          <div className="text-center mb-12">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              Training <span className="gradient-text">Highlights</span>
            </motion.h3>
          </div>
          
          <PhotoGallery 
            photos={featuredPhotos.slice(0, 6)} 
            columns={3}
            showMetadata={true}
            enableLightbox={true}
            enableSharing={true}
            className="mb-8"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link
              to="/journey"
              className="btn-secondary"
              onClick={() => handleCTAClick('View All Photos')}
            >
              View Complete Gallery
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Community Impact */}
      <CommunityImpact />

      {/* Social Feed */}
      <section className="section-padding bg-gradient-to-b from-slate-900 to-gray-900">
        <div className="container-max">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Follow the <span className="gradient-text">Journey</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gold-200 max-w-3xl mx-auto mb-8"
            >
              Get exclusive behind-the-scenes content, training updates, and daily motivation from Kumar.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center space-x-6"
            >
              <a
                href="https://instagram.com/kumarprescod"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gold-300 hover:text-gold-200 transition-colors duration-200"
                onClick={() => handleCTAClick('Instagram')}
              >
                <Instagram className="w-6 h-6" />
                <span className="font-semibold">Instagram</span>
              </a>
              <a
                href="https://twitter.com/kumarprescod"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gold-300 hover:text-gold-200 transition-colors duration-200"
                onClick={() => handleCTAClick('Twitter')}
              >
                <Twitter className="w-6 h-6" />
                <span className="font-semibold">Twitter</span>
              </a>
              <a
                href="https://youtube.com/@kumarprescod"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gold-300 hover:text-gold-200 transition-colors duration-200"
                onClick={() => handleCTAClick('YouTube')}
              >
                <Youtube className="w-6 h-6" />
                <span className="font-semibold">YouTube</span>
              </a>
            </motion.div>
          </div>
          <SocialFeed />
        </div>
      </section>

      {/* Championship CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 via-primary-700 to-gold-600 text-white relative overflow-hidden">
        {/* Championship background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-gold-400 rounded-full animate-championship-pulse" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full animate-bounce-slow" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-r from-gold-500/30 to-white/30 rounded-full animate-float" />
        </div>
        
        <div className="container-max text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-gold-400/50 mb-8"
          >
            <span className="text-gold-200 text-sm font-bold tracking-wider uppercase">
              🥊 Join The Championship Journey
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-7xl font-black mb-6"
          >
            Ready to Join the <span className="ring-text">Fight</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl mb-4 max-w-4xl mx-auto font-semibold"
          >
            Support Kumar's journey to championship greatness
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg mb-12 max-w-3xl mx-auto text-white/90"
          >
            Get your tickets, shop exclusive merchandise, or become a sponsor for the Raw One's homecoming fight
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-8"
          >
            <a
              href="/fights/tickets/KumarPrescod8:16 Tickets.html"
              className="btn-champion"
              onClick={() => handleCTAClick('Buy Homecoming Tickets')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Fight Tickets
              <ArrowRight className="w-6 h-6 ml-3" />
            </a>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="btn-secondary"
                onClick={() => handleCTAClick('Shop Now')}
              >
                Shop Merch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/sponsors"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
                onClick={() => handleCTAClick('Become Sponsor')}
              >
                Sponsor Kumar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-8 text-white/90"
          >
            <div className="text-center">
              <div className="text-2xl font-black text-gold-300">Aug 16</div>
              <div className="text-sm font-semibold">Fight Night</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gold-300">$105+</div>
              <div className="text-sm font-semibold">Tickets From</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gold-300">3-0</div>
              <div className="text-sm font-semibold">Perfect Record</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gold-300">FOX</div>
              <div className="text-sm font-semibold">Live Broadcast</div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home; 