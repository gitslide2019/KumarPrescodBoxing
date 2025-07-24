import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Calendar, 
  ArrowRight, 
  Trophy, 
  Target, 
  Users, 
  Clock,
  Zap,
  Medal,
  Flame,
  Star,
  Award
} from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { designTokens } from '../../styles/design-tokens';
import OptimizedImage from '../common/OptimizedImage';

interface HeroStats {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  animated?: boolean;
  suffix?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  highlighted?: boolean;
}

interface FighterSpotlight {
  statName: string;
  statValue: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

const EnhancedHeroSection: React.FC = () => {
  const { trackEvent } = useAnalytics();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate statistics counters
    const animateStats = () => {
      const targets = { wins: 3, knockouts: 3, followers: 50000 };
      
      Object.entries(targets).forEach(([key, target]) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, 50);
      });
    };
    
    // Cycle through fighter spotlight stats
    const spotlightTimer = setInterval(() => {
      setCurrentSpotlight(prev => (prev + 1) % fighterSpotlights.length);
    }, 4000);
    
    setTimeout(animateStats, 500);
    
    return () => {
      clearInterval(spotlightTimer);
    };
  }, []);

  const handleCTAClick = (ctaType: string) => {
    trackEvent('Hero', 'CTA Click', ctaType);
  };

  const heroStats: HeroStats[] = [
    {
      label: 'Professional Record',
      value: `${animatedStats.wins || 0}-0`,
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-championship_gold',
      animated: true
    },
    {
      label: 'Knockout Ratio',
      value: '100',
      suffix: '%',
      icon: <Target className="w-5 h-5" />,
      color: 'text-boxing_red',
      animated: true
    },
    {
      label: 'Age',
      value: '18',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      label: 'Fan Following',
      value: animatedStats.followers ? `${Math.floor(animatedStats.followers / 1000)}K` : '0K',
      suffix: '+',
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-400',
      animated: true
    }
  ];
  
  const fighterSpotlights: FighterSpotlight[] = [
    {
      statName: 'Power Rating',
      statValue: '98/100',
      description: 'Devastating knockout power in both hands',
      trend: 'up',
      color: designTokens.colors.primary.boxing_red
    },
    {
      statName: 'Speed Index',
      statValue: '94/100',
      description: 'Lightning-fast combinations and footwork',
      trend: 'up',
      color: designTokens.colors.primary.championship_gold
    },
    {
      statName: 'Defense Rating',
      statValue: '89/100',
      description: 'Exceptional head movement and ring IQ',
      trend: 'stable',
      color: designTokens.colors.semantic.info
    },
    {
      statName: 'Conditioning',
      statValue: '96/100',
      description: 'Elite cardiovascular and mental endurance',
      trend: 'up',
      color: designTokens.colors.semantic.success
    }
  ];
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: '9x National Amateur Champion',
      description: 'Dominated amateur circuit with 9 consecutive national titles',
      icon: <Medal className="w-6 h-6" />,
      date: '2019-2023',
      highlighted: true
    },
    {
      id: '2',
      title: 'ESPN Rising Star',
      description: 'Featured as top prospect to watch in 2024',
      icon: <Star className="w-6 h-6" />,
      date: '2024'
    },
    {
      id: '3',
      title: 'Perfect Pro Record',
      description: '3-0 with 100% knockout rate in professional career',
      icon: <Award className="w-6 h-6" />,
      date: '2024',
      highlighted: true
    },
    {
      id: '4',
      title: 'Oakland Boxing Ambassador',
      description: 'Representing hometown with pride and excellence',
      icon: <Trophy className="w-6 h-6" />,
      date: '2024'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Kumar Prescod Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/fights/2025-08-16-oakland/IMG_5882.jpg)'
        }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 container mx-auto px-6 text-center text-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Championship Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 mb-8 bg-gradient-to-r from-gold-500/20 to-primary-500/20 backdrop-blur-md rounded-full border border-gold-400/30"
          >
            <Trophy className="w-5 h-5 text-gold-400" />
            <span className="text-gold-high-contrast font-semibold tracking-wide uppercase text-sm">
              🏠 Oakland's Champion • Homecoming Fight
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="display-1 mb-4 leading-none">
              <span className="block text-white">Kumar</span>
              <span className="block boxing-title bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent">
                "The Raw One"
              </span>
              <span className="block text-white">Prescod</span>
            </h1>
            
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary-600/20 to-primary-700/20 backdrop-blur-sm rounded-2xl border border-primary-400/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xl font-semibold text-green-200 tracking-wide">
                Professional Boxer • 3-0 • 100% KO Rate
              </p>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-neutral-200 font-medium mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            18-year-old rising star from Oakland, California. 
            <span className="text-gold-high-contrast font-semibold"> Undefeated. Unstoppable. Unforgettable.</span>
          </motion.p>

          {/* Dynamic Fighter Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpotlight}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-neutral-900/80 via-neutral-800/80 to-neutral-900/80 backdrop-blur-lg rounded-2xl p-6 border border-neutral-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: fighterSpotlights[currentSpotlight].color }}
                    />
                    <h3 className="text-lg font-bold text-white">
                      {fighterSpotlights[currentSpotlight].statName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="text-2xl font-black"
                      style={{ color: fighterSpotlights[currentSpotlight].color }}
                    >
                      {fighterSpotlights[currentSpotlight].statValue}
                    </div>
                    {fighterSpotlights[currentSpotlight].trend === 'up' && (
                      <motion.div 
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-green-400"
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {fighterSpotlights[currentSpotlight].description}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Spotlight Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {fighterSpotlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSpotlight(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSpotlight 
                      ? 'bg-championship_gold scale-125' 
                      : 'bg-neutral-600 hover:bg-neutral-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Enhanced Hero Stats with Animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                transition={{ duration: 0.4, delay: 1.0 + (index * 0.1) }}
                className="bg-neutral-900/60 backdrop-blur-md rounded-2xl p-6 border border-neutral-700/50 hover:border-championship_gold/50 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={`${stat.color} mb-2 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <motion.div
                    animate={stat.animated ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {stat.icon}
                  </motion.div>
                </div>
                <div className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                  <motion.span
                    key={stat.value}
                    initial={stat.animated ? { scale: 0.8, opacity: 0 } : {}}
                    animate={stat.animated ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.span>
                  {stat.suffix && (
                    <span className={stat.color}>{stat.suffix}</span>
                  )}
                </div>
                <div className="text-sm text-neutral-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Championship Achievements Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-championship_gold" />
              Championship Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {achievements.filter(achievement => achievement.highlighted).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + (index * 0.2) }}
                  className="bg-gradient-to-br from-championship_gold/10 via-boxing_red/5 to-neutral-900/50 backdrop-blur-md rounded-2xl p-4 border border-championship_gold/20 hover:border-championship_gold/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-championship_gold group-hover:scale-110 transition-transform duration-300 mt-1">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm mb-1">{achievement.title}</h4>
                      <p className="text-neutral-300 text-xs leading-relaxed mb-2">{achievement.description}</p>
                      <span className="text-championship_gold text-xs font-medium">{achievement.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/fights"
                onClick={() => handleCTAClick('View Fights')}
                className="btn btn-champion btn-lg group relative overflow-hidden min-w-[240px] bg-gradient-to-r from-boxing_red to-championship_gold hover:from-boxing_red/90 hover:to-championship_gold/90 shadow-boxing"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-championship_gold to-boxing_red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <span>Next Fight • Aug 16</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/journey"
                onClick={() => handleCTAClick('Watch Journey')}
                className="btn btn-outline btn-lg group min-w-[240px] border-2 border-championship_gold/50 text-championship_gold hover:bg-championship_gold hover:text-knockout_black backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <span>Watch Journey</span>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-300"
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium">Featured in ESPN</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-neutral-600"></div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              />
              <span className="text-sm font-medium">{animatedStats.followers ? `${Math.floor(animatedStats.followers / 1000)}K` : '50K'}+ Social Followers</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-neutral-600"></div>
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-2 h-2 bg-championship_gold rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              />
              <span className="text-sm font-medium">9x National Amateur Champion</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2.0 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-300 cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            trackEvent('Hero', 'Scroll Indicator', 'Click');
          }}
        >
          <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-current rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedHeroSection;