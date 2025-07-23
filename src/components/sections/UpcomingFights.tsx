import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const UpcomingFights: React.FC = () => {
  const { trackEvent } = useAnalytics();

  const upcomingFights = [
    {
      id: 1,
      title: "Kumar Prescod vs. Marcus Rodriguez",
      date: "December 15, 2024",
      time: "8:00 PM PST",
      venue: "Oakland Arena",
      location: "Oakland, CA",
      ticketPrice: "$45 - $150",
      image: "/images/fight-1.jpg",
      status: "Tickets Available",
      opponent: "Marcus Rodriguez",
      weightClass: "Welterweight",
      rounds: "10 Rounds",
    },
    {
      id: 2,
      title: "Kumar Prescod vs. Carlos Mendoza",
      date: "January 20, 2025",
      time: "7:30 PM PST",
      venue: "Chase Center",
      location: "San Francisco, CA",
      ticketPrice: "$60 - $200",
      image: "/images/fight-2.jpg",
      status: "Coming Soon",
      opponent: "Carlos Mendoza",
      weightClass: "Welterweight",
      rounds: "12 Rounds",
    },
  ];

  const handleTicketClick = (fightId: number, fightTitle: string) => {
    trackEvent('Tickets', 'Click', fightTitle);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {upcomingFights.map((fight, index) => (
        <motion.div
          key={fight.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="card overflow-hidden"
        >
          {/* Fight Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary-600 to-gold-500">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-2">VS</div>
                <div className="text-lg font-semibold">{fight.opponent}</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                fight.status === "Tickets Available" 
                  ? "bg-green-500 text-white" 
                  : "bg-yellow-500 text-white"
              }`}>
                {fight.status}
              </span>
            </div>
          </div>

          {/* Fight Details */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-secondary-900 mb-4">
              {fight.title}
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-secondary-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{fight.date}</span>
              </div>
              <div className="flex items-center text-secondary-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{fight.time}</span>
              </div>
              <div className="flex items-center text-secondary-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{fight.venue}, {fight.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-secondary-600">Weight Class</div>
                <div className="font-semibold text-secondary-900">{fight.weightClass}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-secondary-600">Rounds</div>
                <div className="font-semibold text-secondary-900">{fight.rounds}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-secondary-600">Ticket Prices</div>
                <div className="font-bold text-lg text-primary-600">{fight.ticketPrice}</div>
              </div>
              
              {fight.status === "Tickets Available" ? (
                <Link
                  to={`/tickets/checkout?fight=${fight.id}`}
                  className="btn-primary flex items-center"
                  onClick={() => handleTicketClick(fight.id, fight.title)}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Buy Tickets
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <button className="btn-outline opacity-50 cursor-not-allowed">
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UpcomingFights; 