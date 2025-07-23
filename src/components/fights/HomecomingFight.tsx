import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, Star, Gift, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import CountdownTimer from '../common/CountdownTimer';

interface FightInfo {
  id: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  address: string;
  opponent: {
    name: string;
    record: string;
    nickname: string;
  };
  title: string;
  subtitle: string;
  ticketInfo: {
    onSaleDate: string;
    priceRange: {
      min: number;
      max: number;
    };
    vipPackages: boolean;
    purchaseUrl: string;
    vendorName: string;
  };
  promotion: {
    promoter: string;
    broadcaster: string;
    ppv: boolean;
  };
  files: {
    fightCard: string;
    pressRelease: string;
    poster: string;
    mediaKit: string;
  };
  description: string;
  highlights: string[];
  specialEvents: Array<{
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
  }>;
  status: string;
  lastUpdated: string;
}

interface HomecomingFightProps {
  variant?: 'hero' | 'featured' | 'compact';
  showTickets?: boolean;
  showSpecialEvents?: boolean;
}

const HomecomingFight: React.FC<HomecomingFightProps> = ({
  variant = 'featured',
  showTickets = true,
  showSpecialEvents = true
}) => {
  const [fightInfo, setFightInfo] = useState<FightInfo | null>(null);
  const [timeUntilFight, setTimeUntilFight] = useState<string>('');
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Load fight information
    fetch('/fights/2025-08-16-oakland/info.json')
      .then(response => response.json())
      .then(data => setFightInfo(data))
      .catch(error => console.error('Error loading fight info:', error));
  }, []);

  useEffect(() => {
    if (!fightInfo) return;

    const updateCountdown = () => {
      const fightDate = new Date(`${fightInfo.date}T${fightInfo.time}`);
      const now = new Date();
      const timeDiff = fightDate.getTime() - now.getTime();

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeUntilFight(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeUntilFight('Fight Night!');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [fightInfo]);

  const handleTicketClick = () => {
    trackEvent('Ticket', 'Click', 'Oakland Homecoming Fight');
    if (fightInfo?.ticketInfo.purchaseUrl) {
      window.open(fightInfo.ticketInfo.purchaseUrl, '_blank');
    }
  };

  const handleFileDownload = (fileType: string, url: string) => {
    trackEvent('Download', fileType, 'Oakland Fight');
    window.open(url, '_blank');
  };

  if (!fightInfo) {
    return (
      <div className="bg-gradient-to-br from-amber-900/80 to-red-900/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gold-500/30">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-gold-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <Star className="w-5 h-5 mr-2 text-gold-300" />
              <span className="text-sm font-semibold">HOMECOMING FIGHT</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              {fightInfo.title}
            </h1>
            <p className="text-xl lg:text-2xl text-gold-200 mb-6">
              {fightInfo.subtitle}
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-lg">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-gold-300" />
                <span>August 16, 2025</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-gold-300" />
                <span>{fightInfo.venue}, Oakland</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2 text-gold-300" />
                <span>{fightInfo.time}</span>
              </div>
            </div>

            <div className="mb-8">
              <CountdownTimer 
                targetDate={`${fightInfo.date}T${fightInfo.time}`}
                size="lg"
                variant="glass"
                showLabels={true}
                showSeconds={true}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTicketClick}
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
              >
                <Ticket className="w-6 h-6 mr-2" />
                Get Tickets Now
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border border-white/30">
                Fight Details
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary-600 to-gold-600 text-white rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 mr-2 text-gold-300" />
              <span className="text-sm font-semibold opacity-90">HOMECOMING FIGHT</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{fightInfo.title}</h3>
            <div className="flex items-center text-sm opacity-90">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="mr-4">Aug 16</span>
              <MapPin className="w-4 h-4 mr-1" />
              <span>Oakland, CA</span>
            </div>
          </div>
          <div className="text-center">
            <CountdownTimer 
              targetDate={`${fightInfo.date}T${fightInfo.time}`}
              size="sm"
              variant="minimal"
              showLabels={false}
              showSeconds={false}
              className="mb-2"
            />
            <button
              onClick={handleTicketClick}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Tickets
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default 'featured' variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-amber-900/90 to-red-900/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gold-500/40"
    >
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary-600 to-gold-600 text-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Star className="w-6 h-6 mr-2 text-gold-300" />
            <span className="text-sm font-bold tracking-wider uppercase">🏠 Straight Outta Oakland</span>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Fight Night Countdown</div>
            <div className="text-2xl font-black text-gold-300">{timeUntilFight}</div>
          </div>
        </div>
        
        <h2 className="text-4xl font-black mb-3 gradient-text">"Straight Outta Oakland"</h2>
        <p className="text-xl text-gold-200 mb-2 font-semibold">Kumar Prescod Homecoming Fight</p>
        <p className="text-sm text-white/80 mb-6">
          <span className="font-semibold text-gold-300">G1 Promotions</span> & <span className="font-semibold text-gold-300">Lion's Den Promotions</span> present
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center bg-black/20 rounded-lg p-3">
            <Calendar className="w-6 h-6 mr-3 text-gold-300" />
            <div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Fight Date</div>
              <div className="font-bold text-lg">August 16, 2025</div>
            </div>
          </div>
          <div className="flex items-center bg-black/20 rounded-lg p-3">
            <MapPin className="w-6 h-6 mr-3 text-gold-300" />
            <div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Venue</div>
              <div className="font-bold text-lg">Oakland Marriott City Center</div>
            </div>
          </div>
          <div className="flex items-center bg-black/20 rounded-lg p-3">
            <Clock className="w-6 h-6 mr-3 text-gold-300" />
            <div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Doors Open</div>
              <div className="font-bold text-lg">3:00 PM PST</div>
            </div>
          </div>
        </div>

        {/* Broadcaster Information */}
        <div className="mt-4 flex items-center justify-center bg-gradient-to-r from-primary-600/20 to-gold-500/20 rounded-lg p-3 border border-gold-400/30">
          <span className="text-primary-400 font-bold text-sm mr-2">LIVE ON</span>
          <span className="text-white font-black text-xl">FOX SPORTS</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="bg-gradient-to-r from-amber-800/40 to-red-800/40 rounded-lg p-6 mb-6 border border-gold-400/50">
          <h3 className="text-lg font-bold text-gold-200 mb-3">Fight Night — August 16th 🥊</h3>
          <p className="text-gold-100 mb-4">
            Come show your support as Kumar steps into the ring under G1 Promotions and Lion's Den Promotions 
            at the Oakland Marriott City Center!
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gold-200">📍 Doors Open: 3 PM</p>
              <p className="font-semibold text-gold-200">🥊 First Fight: 4 PM Sharp</p>
            </div>
            <div>
              <p className="font-semibold text-gold-300">💳 +$5 Online Processing Fee</p>
              <p className="font-semibold text-red-600">🚫 No Refunds | No Exchanges</p>
            </div>
          </div>
          <p className="text-sm text-gold-300 mt-4 italic">Bouts subject to change.</p>
        </div>

        {/* VIP Experience Details */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gold-200 mb-3 flex items-center">
            <span className="text-gold-500 mr-2">👑</span>
            VIP Experience
          </h4>
          <div className="bg-gradient-to-r from-amber-800/30 to-yellow-800/30 rounded-lg p-4 border border-gold-400/50">
            <p className="text-gold-100 font-semibold mb-2">
              VIP TICKET: Enjoy exclusive VIP check-in for a fast, hassle-free entry and access to 
              a dedicated VIP line at concessions, so you spend less time waiting and more time enjoying the action.
            </p>
          </div>
        </div>

        {/* Fight Highlights */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-secondary-900 mb-3">Why You Can't Miss This Fight</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start">
              <span className="text-gold-500 mr-2">🏠</span>
              <span className="text-secondary-700">Kumar's first professional fight in Oakland</span>
            </div>
            <div className="flex items-start">
              <span className="text-gold-500 mr-2">🥊</span>
              <span className="text-secondary-700">Perfect 3-0 record with 100% KO rate</span>
            </div>
            <div className="flex items-start">
              <span className="text-gold-500 mr-2">🏆</span>
              <span className="text-secondary-700">9x National Amateur Champion returns home</span>
            </div>
            <div className="flex items-start">
              <span className="text-gold-500 mr-2">📺</span>
              <span className="text-secondary-700">Live broadcast on FOX Sports</span>
            </div>
          </div>
        </div>

        {/* Special Events */}
        {showSpecialEvents && fightInfo.specialEvents.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-primary-600" />
              Special Events
            </h4>
            <div className="space-y-3">
              {fightInfo.specialEvents.map((event, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-secondary-900">{event.name}</h5>
                    <span className="text-sm text-secondary-600">{event.time}</span>
                  </div>
                  <p className="text-sm text-secondary-700 mb-1">{event.description}</p>
                  <p className="text-sm text-secondary-600">{event.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Ticket Pricing Information */}
        {showTickets && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
              <Ticket className="w-5 h-5 mr-2 text-primary-600" />
              Official Ticket Pricing
            </h4>
            <div className="bg-gradient-to-r from-gray-50 to-gold-50 rounded-lg p-6 border border-gold-200">
              {/* VIP Tickets */}
              <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-gold-100 to-yellow-50 rounded-lg border border-gold-300">
                <div>
                  <span className="font-bold text-gold-800 text-lg">VIP TICKETS</span>
                  <div className="text-sm text-gold-700">Exclusive VIP check-in, dedicated concession line</div>
                </div>
                <span className="font-black text-2xl text-gold-600">$255</span>
              </div>
              
              {/* Ringside Tickets */}
              <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-primary-50 to-red-50 rounded-lg border border-primary-200">
                <div>
                  <span className="font-bold text-primary-800 text-lg">RINGSIDE</span>
                  <div className="text-sm text-primary-700">Premium ringside viewing experience</div>
                </div>
                <span className="font-black text-2xl text-primary-600">$155</span>
              </div>
              
              {/* Floor A Tickets */}
              <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-gray-100 to-slate-50 rounded-lg border border-gray-300">
                <div>
                  <span className="font-bold text-gray-800 text-lg">FLOOR A</span>
                  <div className="text-sm text-gray-700">Great floor-level seats</div>
                </div>
                <span className="font-black text-2xl text-gray-600">$105</span>
              </div>
              
              <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Processing Fee: +$5 online</span>
                  <span className="font-semibold">🚫 No Refunds | No Exchanges</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Powered by PayPal • Secure Payment Processing</div>
              </div>
            </div>
          </div>
        )}

        {/* Championship Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <a
            href="/fights/tickets/KumarPrescod8:16 Tickets.html"
            className="btn-champion flex items-center justify-center"
            onClick={handleTicketClick}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Ticket className="w-6 h-6 mr-3" />
            Get Fight Tickets
            <ArrowRight className="w-5 h-5 ml-3" />
          </a>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {fightInfo.files.fightCard && (
              <button
                onClick={() => handleFileDownload('Fight Card', fightInfo.files.fightCard)}
                className="btn-secondary flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Fight Card
              </button>
            )}

            {fightInfo.files.pressRelease && (
              <button
                onClick={() => handleFileDownload('Press Release', fightInfo.files.pressRelease)}
                className="btn-outline flex items-center justify-center"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Press Kit
              </button>
            )}
          </div>
        </div>

        {/* PayPal Integration Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-600 font-semibold text-sm">💳 Secure Checkout:</span>
            <span className="text-blue-800 text-sm ml-2">All ticket purchases are processed securely through PayPal</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomecomingFight;