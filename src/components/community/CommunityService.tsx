import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, GraduationCap, Award, Calendar, MapPin, ArrowRight, Star } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'youth_program' | 'charity' | 'education' | 'mentorship' | 'fundraiser';
  impact: string;
  image?: string;
  participants?: number;
  featured?: boolean;
}

const communityEvents: CommunityEvent[] = [
  {
    id: 'youth-boxing-program',
    title: 'Oakland Youth Boxing Program',
    description: 'Weekly training sessions for underprivileged youth in Oakland, teaching boxing fundamentals, discipline, and life skills.',
    date: 'Every Saturday',
    location: 'Oakland Community Center',
    type: 'youth_program',
    impact: 'Trained over 150 local youth',
    participants: 45,
    featured: true,
    image: '/images/community/youth-boxing.jpg'
  },
  {
    id: 'school-visits',
    title: 'Anti-Bullying School Visits',
    description: 'Visiting local elementary and middle schools to speak about anti-bullying, self-confidence, and pursuing your dreams.',
    date: 'Monthly',
    location: 'Oakland Public Schools',
    type: 'education',
    impact: 'Reached 2,000+ students',
    participants: 500,
    image: '/images/community/school-visit.jpg'
  },
  {
    id: 'food-drive',
    title: 'Holiday Food Drive',
    description: 'Organizing and distributing holiday meals to families in need throughout the Oakland community.',
    date: 'December 2023',
    location: 'Multiple Oakland locations',
    type: 'charity',
    impact: '500 families fed',
    participants: 75,
    featured: true,
    image: '/images/community/food-drive.jpg'
  },
  {
    id: 'mentorship',
    title: 'One-on-One Mentorship',
    description: 'Personal mentoring program for at-risk youth, providing guidance, support, and positive role modeling.',
    date: 'Ongoing',
    location: 'Various Oakland locations',
    type: 'mentorship',
    impact: '25 active mentees',
    participants: 25,
    image: '/images/community/mentorship.jpg'
  },
  {
    id: 'equipment-donation',
    title: 'Boxing Equipment Donation',
    description: 'Donated boxing gloves, punching bags, and training equipment to local community centers and schools.',
    date: 'September 2023',
    location: 'Oakland Community Centers',
    type: 'charity',
    impact: '$15,000 in equipment donated',
    image: '/images/community/equipment-donation.jpg'
  },
  {
    id: 'college-prep',
    title: 'College Prep Workshops',
    description: 'Helping high school students with college applications, scholarship searches, and career planning.',
    date: 'Quarterly',
    location: 'Oakland High Schools',
    type: 'education',
    impact: '80% of participants applied to college',
    participants: 120,
    image: '/images/community/college-prep.jpg'
  }
];

const typeIcons = {
  youth_program: Users,
  charity: Heart,
  education: GraduationCap,
  mentorship: Award,
  fundraiser: Star
};

const typeColors = {
  youth_program: 'from-blue-500 to-blue-600',
  charity: 'from-red-500 to-red-600',
  education: 'from-green-500 to-green-600',
  mentorship: 'from-purple-500 to-purple-600',
  fundraiser: 'from-gold-500 to-gold-600'
};

const CommunityService: React.FC = () => {
  const { trackEvent } = useAnalytics();

  const handleEventClick = (event: CommunityEvent) => {
    trackEvent('Community', 'Event Click', event.title);
  };

  const handleVolunteerClick = () => {
    trackEvent('Community', 'Volunteer Interest');
  };

  const featuredEvents = communityEvents.filter(event => event.featured);
  const regularEvents = communityEvents.filter(event => !event.featured);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-4"
          >
            <Heart className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700 font-semibold">Community Impact</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Giving Back to <span className="gradient-text">Oakland</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Kumar believes in using his platform to uplift his community. From youth boxing programs to educational initiatives, 
            he's committed to making a positive impact in Oakland.
          </motion.p>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Programs</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvents.map((event, index) => {
                const IconComponent = typeIcons[event.type];
                const gradientColor = typeColors[event.type];
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Event Image Placeholder */}
                    <div className={`h-48 bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                      <IconComponent className="w-16 h-16 text-white" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradientColor} text-white`}>
                          <IconComponent className="w-4 h-4 mr-1" />
                          {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {event.featured && (
                          <Star className="w-5 h-5 text-gold-500 fill-current" />
                        )}
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        {event.participants && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2" />
                            {event.participants} participants
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3 mb-4">
                        <p className="text-green-700 font-semibold text-sm">
                          Impact: {event.impact}
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEventClick(event)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Events Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Community Initiatives</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map((event, index) => {
              const IconComponent = typeIcons[event.type];
              const gradientColor = typeColors[event.type];
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${gradientColor} rounded-lg flex items-center justify-center mr-3`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-md p-2">
                    <p className="text-green-700 font-medium text-xs">
                      {event.impact}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Join Kumar's Community Impact</h3>
            <p className="text-lg mb-6 opacity-90">
              Want to get involved? We're always looking for volunteers and partners to help expand our community programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVolunteerClick}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Volunteer With Us
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => trackEvent('Community', 'Partnership Inquiry')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Partner With Kumar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityService;