import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Award, Zap, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface SponsorshipBenefit {
  text: string;
  highlighted?: boolean;
}

interface SponsorshipTier {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  benefits: SponsorshipBenefit[];
  popular?: boolean;
  premium?: boolean;
  buttonText: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

const sponsorshipTiers: SponsorshipTier[] = [
  {
    id: 'supporter',
    name: 'Team Supporter',
    price: 500,
    duration: 'per event',
    description: 'Perfect for local businesses wanting to support Kumar\'s journey',
    benefits: [
      { text: 'Logo on Kumar\'s training gear' },
      { text: 'Social media mentions' },
      { text: 'Website listing' },
      { text: 'Digital thank you post' },
      { text: 'Exclusive training updates' }
    ],
    buttonText: 'Become a Supporter',
    icon: Star,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'champion',
    name: 'Champion Partner',
    price: 2500,
    duration: 'per fight',
    description: 'Enhanced visibility and partnership benefits',
    benefits: [
      { text: 'Logo on fight shorts and robe', highlighted: true },
      { text: 'Banner at training gym' },
      { text: 'Social media campaign features' },
      { text: 'Website homepage listing' },
      { text: 'Press release mentions' },
      { text: '2 VIP fight tickets' },
      { text: 'Meet & greet opportunities' }
    ],
    popular: true,
    buttonText: 'Partner with Kumar',
    icon: Award,
    color: 'primary',
    gradient: 'from-primary-500 to-primary-600'
  },
  {
    id: 'elite',
    name: 'Elite Sponsor',
    price: 10000,
    duration: 'per year',
    description: 'Premium sponsorship with maximum exposure and exclusive access',
    benefits: [
      { text: 'Primary logo placement on all gear', highlighted: true },
      { text: 'Custom branded merchandise' },
      { text: 'Exclusive video content creation' },
      { text: 'Press conference presence' },
      { text: '10 VIP event tickets' },
      { text: 'Training camp access' },
      { text: 'Co-branded marketing materials' },
      { text: 'First right of renewal' }
    ],
    premium: true,
    buttonText: 'Become Elite Sponsor',
    icon: Crown,
    color: 'gold',
    gradient: 'from-gold-500 to-gold-600'
  }
];

const SponsorshipTiers: React.FC = () => {
  const { trackEvent, trackSponsorInquiry } = useAnalytics();

  const handleTierClick = (tier: SponsorshipTier) => {
    trackSponsorInquiry(tier.name);
    trackEvent('Sponsorship', 'Tier Click', tier.name, tier.price);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-4"
          >
            <Zap className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-primary-700 font-semibold">Sponsorship Opportunities</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Partner with a <span className="gradient-text">Rising Champion</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Join Kumar's journey to championship glory and gain valuable exposure while supporting a dedicated young athlete from Oakland.
          </motion.p>
        </div>

        {/* Sponsorship Tiers */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sponsorshipTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                tier.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              } ${tier.premium ? 'ring-2 ring-gold-500' : ''}`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Premium Badge */}
              {tier.premium && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Premium
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 bg-gradient-to-r ${tier.gradient} text-white`}>
                <div className="flex items-center justify-center mb-4">
                  <tier.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">{tier.name}</h3>
                <div className="text-center">
                  <span className="text-3xl font-bold">{formatCurrency(tier.price)}</span>
                  <span className="text-lg opacity-90">/{tier.duration}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">{tier.description}</p>

                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <Check className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                        benefit.highlighted 
                          ? 'text-gold-500' 
                          : tier.color === 'primary' 
                            ? 'text-primary-500' 
                            : tier.color === 'gold'
                              ? 'text-gold-500'
                              : 'text-blue-500'
                      }`} />
                      <span className={`${
                        benefit.highlighted ? 'font-semibold text-gray-900' : 'text-gray-700'
                      }`}>
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTierClick(tier)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                    tier.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : tier.premium
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {tier.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Sponsorship CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Package?</h3>
            <p className="text-lg mb-6 opacity-90">
              We can create a tailored sponsorship package that fits your specific needs and budget.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                trackEvent('Sponsorship', 'Custom Package Inquiry');
                trackSponsorInquiry('Custom Package');
              }}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Us for Custom Options
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Questions about sponsorship? Email us at{' '}
            <a href="mailto:sponsors@kumarprescod.com" className="text-primary-600 hover:text-primary-700 font-semibold">
              sponsors@kumarprescod.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipTiers;