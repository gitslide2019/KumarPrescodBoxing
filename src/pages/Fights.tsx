import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Play, Calendar, MapPin, Trophy, Target, Clock } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import HomecomingFight from '../components/fights/HomecomingFight';

const Fights: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'Fights');
  }, [trackEvent]);

  const pastFights = [
    {
      id: 1,
      opponent: "Rueben Johnson",
      result: "TKO Win",
      date: "2024",
      location: "Stockton, CA",
      round: "Round 2",
      videoUrl: "https://youtu.be/5VgsIdypBjk?si=837Kboxg0aRQHqt7",
      description: "Kumar's latest victory showcasing his patient, composed style and powerful combinations."
    },
    {
      id: 2,
      opponent: "Skyler Mauller",
      result: "TKO Win",
      date: "2024",
      location: "Bay Area, CA",
      round: "Round 1",
      videoUrl: "https://youtu.be/AxGJfPwO94Q?si=0z48OSiVZ3KQewgY",
      description: "Dominant performance demonstrating Kumar's knockout power and technical precision."
    },
    {
      id: 3,
      opponent: "Ernesto Gutierrez",
      result: "TKO Win",
      date: "2024",
      location: "California",
      round: "Round 1",
      videoUrl: null,
      description: "Kumar's professional debut - a statement victory that announced his arrival to the pro scene."
    }
  ];

  const upcomingFights = [
    {
      id: 1,
      opponent: "TBA",
      date: "2025-08-16",
      location: "Oakland, CA",
      venue: "Oakland Arena",
      status: "Homecoming Fight",
      description: "Kumar returns to his hometown Oakland for a special homecoming fight.",
      isHomecoming: true
    }
  ];

  const handleVideoClick = (videoUrl: string, opponent: string) => {
    trackEvent('Video', 'Fight Highlight', opponent);
    window.open(videoUrl, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Fights - Kumar Prescod | Boxing Schedule & Tickets</title>
        <meta name="description" content="View Kumar Prescod's fight record, watch highlight videos, and stay updated on upcoming bouts." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
          <div className="container-max text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Fight <span className="text-gold-300">Record</span>
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Watch Kumar "The Raw One" Prescod's professional fights and stay updated on upcoming bouts
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-300">3-0</div>
                  <div className="text-sm opacity-80">Professional Record</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-300">3</div>
                  <div className="text-sm opacity-80">Knockouts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-300">100%</div>
                  <div className="text-sm opacity-80">Finish Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-max py-12">
          {/* Homecoming Fight Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <HomecomingFight variant="hero" />
          </motion.section>

          {/* Past Fights */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
              <Trophy className="w-8 h-8 mr-3 text-primary-600" />
              Past Fights
            </h2>
            <div className="grid gap-6">
              {pastFights.map((fight, index) => (
                <motion.div
                  key={fight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-secondary-900 mr-4">
                          vs. {fight.opponent}
                        </h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {fight.result}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {fight.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {fight.location}
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {fight.round}
                        </div>
                      </div>
                      <p className="text-secondary-700">{fight.description}</p>
                    </div>
                    {fight.videoUrl && (
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <button
                          onClick={() => handleVideoClick(fight.videoUrl!, fight.opponent)}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Watch Highlights
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Upcoming Fights */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-primary-600" />
              Upcoming Fights
            </h2>
            <div className="grid gap-6">
              {upcomingFights.map((fight, index) => (
                <motion.div
                  key={fight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {fight.isHomecoming ? (
                    <HomecomingFight variant="featured" />
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-primary-600">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-bold text-secondary-900 mr-4">
                              vs. {fight.opponent}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {fight.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {fight.date}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {fight.location}
                            </div>
                          </div>
                          <p className="text-secondary-700">{fight.description}</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <button className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
                            <Clock className="w-5 h-5 mr-2 inline" />
                            Stay Tuned
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Fight Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
              Fight <span className="gradient-text">Statistics</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">3-0</div>
                <div className="text-secondary-600">Professional Record</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                <div className="text-secondary-600">TKO Victories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-secondary-600">Finish Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">1.3</div>
                <div className="text-secondary-600">Avg. Rounds</div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Fights; 