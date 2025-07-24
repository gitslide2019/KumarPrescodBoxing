import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Trophy, Target, Users, Award } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import CommunityService from '../components/community/CommunityService';

const About: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'About');
  }, [trackEvent]);

  const achievements = [
    { icon: Trophy, title: "Professional Record", value: "3-0" },
    { icon: Target, title: "KO Rate", value: "100%" },
    { icon: Award, title: "National Titles", value: "9x" },
    { icon: Users, title: "Team USA", value: "2x" },
  ];

  const timeline = [
    {
      year: "2006",
      title: "Born in Hayward/Oakland",
      description: "Kumar Tyson Prescod was born and raised in the Hayward/Oakland area of California."
    },
    {
      year: "2012",
      title: "Started Boxing",
      description: "At age 6, Kumar began training under his father Kuma Prescod, laying the foundation for greatness."
    },
    {
      year: "2012-2023",
      title: "Amateur Dominance",
      description: "Kumar dominated the amateur scene with a 63-8 record, winning 9 national titles and competing 2x for Team USA."
    },
    {
      year: "2023",
      title: "Professional Debut",
      description: "Turned professional at age 17 with a TKO victory over Ernesto Gutierrez, beginning his pro journey."
    },
    {
      year: "2024",
      title: "Perfect Start",
      description: "Maintained perfect 3-0 record with 3 KOs, defeating Skyler Mauller and Rueben Johnson."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Kumar Prescod - Professional Boxer | Oakland, CA</title>
        <meta name="description" content="Learn about Kumar Prescod's journey from the streets of Oakland to becoming a professional boxing prodigy at just 18 years old." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container-max text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold mb-6"
          >
            The <span className="gradient-text">Story</span> Behind the Fighter
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            From the streets of Oakland to the world stage, Kumar Prescod's journey is a testament to 
            determination, talent, and the power of believing in yourself.
          </motion.p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section-padding bg-gradient-to-b from-amber-900/50 to-red-900/50">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-secondary-900 mb-6">
                Meet <span className="gradient-text">Kumar Prescod</span>
              </h2>
              <div className="space-y-4 text-lg text-secondary-700">
                <p>
                  Born and raised in the Hayward/Oakland area, Kumar Tyson "The Raw One" Prescod discovered his passion for boxing 
                  at the age of 6 under the guidance of his father Kuma Prescod. What started as family training quickly became a calling 
                  that would define his legacy.
                </p>
                <p>
                  After dominating the amateur scene with an exceptional 63-8 record, 9 national titles, and representing Team USA twice, Kumar turned professional 
                  at 17 with explosive results. His patient, composed style combined with powerful combinations has led to a perfect 
                  3-0 record with 3 knockouts - a 100% finish rate that has the boxing world taking notice.
                </p>
                <p>
                  Standing 6'0" and competing at light heavyweight (~175-177 lbs), Kumar draws inspiration from champions like 
                  Errol Spence Jr. and Abdullah Mason. At just 18, he's not just a boxer—he's "The Raw One" with world championship 
                  potential, representing Bay Area pride and proving that with elite amateur pedigree and relentless dedication, greatness awaits.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-600 to-gold-500 h-96 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🥊</div>
                  <div className="text-2xl font-bold">Kumar Prescod</div>
                  <div className="text-lg opacity-80">Professional Boxer</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              <span className="gradient-text">Achievements</span> & Records
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Kumar's impressive statistics and achievements speak for themselves.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-2">
                  {achievement.value}
                </div>
                <div className="text-secondary-600 font-medium">
                  {achievement.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              The <span className="gradient-text">Journey</span> So Far
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              From his first boxing class to becoming a professional fighter, follow Kumar's incredible journey.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-600 to-gold-500"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gradient-to-br from-amber-900/70 to-red-900/70 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gold-500/40">
                      <div className="text-2xl font-bold text-gold-high-contrast mb-2">{item.year}</div>
                      <div className="text-xl font-semibold text-gold-100 mb-2">{item.title}</div>
                      <div className="text-gold-high-contrast">{item.description}</div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              <span className="gradient-text">Values</span> & Mission
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Kumar's core values that drive his success both in and out of the ring.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Dedication",
                description: "Every day is an opportunity to improve. Kumar's commitment to training and self-improvement is unmatched.",
                icon: "💪"
              },
              {
                title: "Community",
                description: "Representing Oakland and giving back to the community that raised him is at the heart of everything Kumar does.",
                icon: "🏘️"
              },
              {
                title: "Excellence",
                description: "Striving for perfection in every aspect of life, from boxing technique to personal character.",
                icon: "⭐"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">{value.title}</h3>
                <p className="text-secondary-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Strategy Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Road to <span className="text-gold-high-contrast">Championship</span>
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Kumar's comprehensive promotional strategy to reach world championship potential
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Marketing & Branding",
                items: [
                  "Signature \"The Raw One\" brand identity",
                  "Bay Area pride storytelling angle",
                  "Highlight 9x national titles & 63-8 amateur record",
                  "Professional hero imagery & visuals"
                ],
                icon: "🎯"
              },
              {
                title: "Digital & Social Presence",
                items: [
                  "Official Instagram, TikTok, YouTube channels",
                  "Training montages & father-son sessions",
                  "\"Road to World\" documentary series",
                  "Live Q&As & community engagement"
                ],
                icon: "📱"
              },
              {
                title: "Local & Regional Integration",
                items: [
                  "Oakland/Hayward gym partnerships",
                  "Youth outreach & motivational talks",
                  "Bay Area media features",
                  "Community-focused events"
                ],
                icon: "🏘️"
              },
              {
                title: "Sponsorship & Partnerships",
                items: [
                  "Bay Area brand partnerships",
                  "Athletic wear & equipment deals",
                  "Local restaurant & gym sponsors",
                  "Tech startup collaborations"
                ],
                icon: "🤝"
              },
              {
                title: "Fight Strategy & Matchmaking",
                items: [
                  "Strategic opponent selection",
                  "Stockton/Bay Area to Vegas progression",
                  "Streaming platform broadcast deals",
                  "Title-series matchup fast-track"
                ],
                icon: "🥊"
              },
              {
                title: "Long-term Vision",
                items: [
                  "6-8 fights in next 18 months",
                  "Regional/national titles by year 3-4",
                  "World championship shot within 5 years",
                  "Elite team management & PR"
                ],
                icon: "🏆"
              }
            ].map((strategy, index) => (
              <motion.div
                key={strategy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-4">{strategy.icon}</div>
                <h3 className="text-xl font-bold mb-4">{strategy.title}</h3>
                <ul className="space-y-2">
                  {strategy.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-gold-high-contrast mr-2">•</span>
                      <span className="text-sm text-primary-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-primary-100 mb-6">
              Kumar combines elite amateur pedigree (63-8 record, 9x National Champion, 2x Team USA), raw knockout power, and a compelling Bay Area story. 
              This comprehensive strategy positions him to rise through the rankings toward world championship glory.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-gold-high-contrast font-semibold">Elite Amateur Pedigree</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-gold-high-contrast font-semibold">100% KO Rate</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-gold-high-contrast font-semibold">Bay Area Pride</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-gold-high-contrast font-semibold">World Championship Potential</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Service Section */}
      <CommunityService />
    </>
  );
};

export default About; 