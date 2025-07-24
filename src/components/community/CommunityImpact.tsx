import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, GraduationCap, DollarSign, MapPin, Award, TrendingUp, Calendar } from 'lucide-react';
import { useCommunity } from '../../contexts/CommunityContext';

interface StatCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color, delay = 0, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-amber-900/60 to-red-900/60 backdrop-blur-sm rounded-xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 border border-gold-500/30"
  >
    <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay + 0.2, type: "spring", stiffness: 100 }}
      className="text-3xl font-bold text-gold-high-contrast mb-2"
    >
      {typeof value === 'number' && value > 999 ? 
        `${(value / 1000).toFixed(1)}K` : 
        value
      }
    </motion.div>
    <div className="text-gold-100 font-medium mb-2">{label}</div>
    {description && (
      <div className="text-sm text-gold-high-contrast">{description}</div>
    )}
  </motion.div>
);

const CommunityImpact: React.FC = () => {
  const { stats, getActivePrograms } = useCommunity();
  const activePrograms = getActivePrograms();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return num >= 10000 ? `$${Math.round(num / 1000)}K` : `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const impactStats = [
    {
      icon: Users,
      label: 'People Served',
      value: stats.peopleServed,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'Lives touched through our programs'
    },
    {
      icon: GraduationCap,
      label: 'Schools Visited',
      value: stats.schoolsVisited,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      description: 'Oakland schools reached'
    },
    {
      icon: Heart,
      label: 'Youth Mentored',
      value: stats.youthMentored,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      description: 'Young people guided'
    },
    {
      icon: DollarSign,
      label: 'Community Investment',
      value: formatNumber(stats.fundsRaised + stats.equipmentDonated),
      color: 'bg-gradient-to-r from-green-600 to-green-700',
      description: 'In funds and equipment donated'
    },
    {
      icon: TrendingUp,
      label: 'Active Programs',
      value: stats.activePrograms,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      description: 'Ongoing community initiatives'
    },
    {
      icon: Award,
      label: 'Volunteers Recruited',
      value: stats.volunteersRecruited,
      color: 'bg-gradient-to-r from-gold-500 to-gold-600',
      description: 'Community members engaged'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-4"
          >
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-semibold">Community Impact</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Making a Real <span className="gradient-text">Difference</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            These numbers represent more than statistics—they represent lives changed, dreams supported, and a community strengthened.
          </motion.p>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {impactStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              delay={index * 0.1}
              description={stat.description}
            />
          ))}
        </div>

        {/* Active Programs Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-900/70 to-red-900/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-gold-500/40"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gold-high-contrast mb-4">Currently Active Programs</h3>
            <p className="text-gold-100">
              These ongoing initiatives continue to serve our Oakland community every day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePrograms.slice(0, 6).map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200"
              >
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{program.title}</h4>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {program.date}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {program.location}
                </div>
                <div className="text-sm font-medium text-primary-600">
                  {program.impact}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                "Success in the ring means nothing without success in the community."
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Kumar's commitment to Oakland goes beyond boxing. Every victory in the ring is shared with the community 
                that shaped him, and every opportunity is used to lift others up.
              </p>
              <div className="text-primary-200 font-medium">
                — Kumar Prescod, Professional Boxer & Community Leader
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityImpact;