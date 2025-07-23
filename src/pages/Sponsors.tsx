import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Zap, TrendingUp, Users, Award, MapPin, Camera } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useFunding } from '../contexts/FundingContext';
import SponsorshipTiers from '../components/funding/SponsorshipTiers';
import FundingDashboard from '../components/funding/FundingDashboard';

const Sponsors: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'Sponsors');
  }, [trackEvent]);

  return (
    <>
      <Helmet>
        <title>Sponsors - Kumar Prescod | Partnership Opportunities</title>
        <meta name="description" content="Partner with Kumar Prescod. Explore sponsorship opportunities and become part of the next boxing superstar's journey." />
      </Helmet>

      <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="container-max text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
            <span className="gradient-text">Sponsors</span> & Funding
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Join Kumar's journey to championship glory. Partner with us through sponsorships or support his training through our crowdfunding campaigns.
          </p>
        </div>

        {/* Funding Dashboard */}
        <div className="container-max mb-16">
          <FundingDashboard />
        </div>

        {/* Partnership Opportunities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-max mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              <span className="gradient-text">Partnership</span> Opportunities
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Join Kumar's journey to world championship glory through strategic partnerships and sponsorships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Bay Area Brands",
                description: "Partner with local Oakland/Hayward businesses to build community presence and mutual support",
                icon: MapPin,
                benefits: [
                  "Local community engagement",
                  "Shared marketing campaigns",
                  "Cross-promotional opportunities",
                  "Authentic Bay Area storytelling"
                ],
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Athletic Wear & Equipment",
                description: "Exclusive partnerships with boxing gear, athletic wear, and equipment manufacturers",
                icon: Zap,
                benefits: [
                  "Product endorsements",
                  "Training gear partnerships",
                  "Competition equipment deals",
                  "Co-branded merchandise"
                ],
                color: "from-green-500 to-green-600"
              },
              {
                title: "Corporate Sponsors",
                description: "Strategic partnerships with restaurants, gyms, tech startups, and established corporations",
                icon: Users,
                benefits: [
                  "Brand visibility at events",
                  "Digital marketing exposure",
                  "Exclusive sponsor content",
                  "VIP event access"
                ],
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Media & Broadcasting",
                description: "Partnerships with streaming platforms, sports networks, and content creators",
                icon: Camera,
                benefits: [
                  "Fight broadcast opportunities",
                  "Behind-the-scenes content",
                  "Documentary partnerships",
                  "Social media collaborations"
                ],
                color: "from-orange-500 to-orange-600"
              },
              {
                title: "Fitness & Nutrition",
                description: "Collaborate with fitness centers, nutrition brands, and health-focused companies",
                icon: Target,
                benefits: [
                  "Training facility partnerships",
                  "Nutrition product endorsements",
                  "Fitness program development",
                  "Health & wellness content"
                ],
                color: "from-red-500 to-red-600"
              },
              {
                title: "Community Impact",
                description: "Partner with nonprofits and community organizations for youth outreach and development",
                icon: Users,
                benefits: [
                  "Youth boxing programs",
                  "Community events",
                  "Educational initiatives",
                  "Mentorship opportunities"
                ],
                color: "from-teal-500 to-teal-600"
              }
            ].map((opportunity, index) => (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${opportunity.color} rounded-lg flex items-center justify-center mb-4`}>
                  <opportunity.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{opportunity.title}</h3>
                <p className="text-secondary-600 mb-4">{opportunity.description}</p>
                <ul className="space-y-2">
                  {opportunity.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span className="text-sm text-secondary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Partner with Kumar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-max mb-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Why Partner with <span className="text-gold-300">Kumar "The Raw One" Prescod</span>?
              </h2>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Invest in the future of boxing with a proven champion who combines elite talent with authentic Bay Area roots
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Award,
                  title: "Elite Amateur Pedigree",
                  description: "9x National Champion, Former Team USA Youth competitor with proven track record"
                },
                {
                  icon: TrendingUp,
                  title: "Perfect Professional Record",
                  description: "3-0 with 3 KOs - 100% finish rate demonstrates explosive potential"
                },
                {
                  icon: Users,
                  title: "Authentic Community Connection",
                  description: "Deep roots in Oakland/Hayward area with genuine community engagement"
                },
                {
                  icon: Zap,
                  title: "Championship Trajectory",
                  description: "Clear path to world title with strategic 5-year plan and elite training"
                }
              ].map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="w-8 h-8 text-gold-300" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                  <p className="text-sm text-primary-100">{reason.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-primary-100 mb-6">
                Ready to join Kumar's championship journey? Contact us to discuss partnership opportunities.
              </p>
              <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Become a Partner
              </button>
            </div>
          </div>
        </motion.section>

        {/* Sponsorship Tiers */}
        <SponsorshipTiers />
      </div>
    </>
  );
};

export default Sponsors; 