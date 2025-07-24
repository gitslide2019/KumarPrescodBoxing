import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, Users, Trophy, Target } from 'lucide-react';
import { Fighter, Event, Venue } from '../../types/boxing';
import { designTokens } from '../../styles/design-tokens';
import OptimizedImage from '../common/OptimizedImage';

interface FightPosterCardProps {
  event: Event;
  mainFighter: Fighter;
  opponent: Fighter;
  size?: 'small' | 'medium' | 'large';
  showCountdown?: boolean;
  showTickets?: boolean;
  onTicketClick?: () => void;
  className?: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FightPosterCard: React.FC<FightPosterCardProps> = ({
  event,
  mainFighter,
  opponent,
  size = 'medium',
  showCountdown = true,
  showTickets = true,
  onTicketClick,
  className = ''
}) => {
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // Calculate countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const eventTime = new Date(event.date).getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  const sizeClasses = {
    small: 'w-80 h-96',
    medium: 'w-96 h-[28rem]',
    large: 'w-[32rem] h-[40rem]'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const eventDate = formatDate(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        ${sizeClasses[size]} 
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900
        border border-neutral-700/50
        shadow-2xl hover:shadow-boxing
        ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(220,38,38,0.3)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(245,158,11,0.3)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      {/* Header with Event Title */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="px-3 py-1 bg-gradient-to-r from-boxing_red to-championship_gold rounded-full">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {event.status === 'Live' ? '🔴 LIVE' : event.status.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-championship_gold">{eventDate.day}</div>
            <div className="text-xs text-neutral-400 uppercase">{eventDate.month}</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
          {event.title}
        </h2>

        <div className="flex items-center gap-2 text-neutral-300 text-sm">
          <MapPin className="w-4 h-4 text-championship_gold" />
          <span>{event.venue.city}, {event.venue.state}</span>
        </div>
      </div>

      {/* Fighter vs Fighter Section */}
      <div className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Main Fighter */}
          <div className="flex-1 text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-championship_gold shadow-gold">
                <OptimizedImage
                  src={mainFighter.profileImage}
                  alt={`${mainFighter.name} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-championship_gold rounded-full flex items-center justify-center">
                <Trophy className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-white text-lg leading-tight">{mainFighter.name}</h3>
            <p className="text-championship_gold text-sm font-medium">
              {mainFighter.record.wins}-{mainFighter.record.losses}-{mainFighter.record.draws}
            </p>
            <p className="text-neutral-400 text-xs">{mainFighter.weightClass}</p>
          </div>

          {/* VS Divider */}
          <div className="flex-shrink-0 mx-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-boxing_red to-championship_gold flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">VS</span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-neutral-600/30"
              />
            </div>
          </div>

          {/* Opponent */}
          <div className="flex-1 text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-neutral-600 shadow-lg">
                <OptimizedImage
                  src={opponent.profileImage}
                  alt={`${opponent.name} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-boxing_red rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-white text-lg leading-tight">{opponent.name}</h3>
            <p className="text-boxing_red text-sm font-medium">
              {opponent.record.wins}-{opponent.record.losses}-{opponent.record.draws}
            </p>
            <p className="text-neutral-400 text-xs">{opponent.weightClass}</p>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="relative z-10 px-6 py-4 space-y-3">
        <div className="flex items-center gap-3 text-neutral-300 text-sm">
          <Calendar className="w-4 h-4 text-championship_gold" />
          <span>{eventDate.time} • {eventDate.month} {eventDate.day}, {eventDate.year}</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-300 text-sm">
          <MapPin className="w-4 h-4 text-championship_gold" />
          <span>{event.venue.name}</span>
        </div>

        {event.venue.capacity && (
          <div className="flex items-center gap-3 text-neutral-300 text-sm">
            <Users className="w-4 h-4 text-championship_gold" />
            <span>Capacity: {event.venue.capacity.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      <AnimatePresence>
        {showCountdown && !isExpired && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 px-6 py-4 border-t border-neutral-700/50"
          >
            <div className="text-center">
              <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">
                Fight starts in
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Min', value: countdown.minutes },
                  { label: 'Sec', value: countdown.seconds }
                ].map((unit, index) => (
                  <motion.div
                    key={unit.label}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-neutral-800/50 rounded-lg p-2 border border-neutral-700/30"
                  >
                    <div className="text-championship_gold font-bold text-lg">
                      {unit.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-neutral-400 text-xs uppercase">
                      {unit.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket CTA */}
      <AnimatePresence>
        {showTickets && event.ticketUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 p-6 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTicketClick}
              className="w-full bg-gradient-to-r from-boxing_red to-championship_gold hover:from-boxing_red/90 hover:to-championship_gold/90 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-boxing"
            >
              <Ticket className="w-5 h-5" />
              <span>Get Tickets</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fight Status Overlay */}
      {isExpired && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-20"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🥊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Fight Completed</h3>
            <p className="text-neutral-400">Check results and highlights</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FightPosterCard;