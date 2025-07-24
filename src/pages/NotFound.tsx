import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Menu } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { designTokens } from '../styles/design-tokens';

const NotFound: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Error', '404 Page View', window.location.pathname);
  }, [trackEvent]);

  const handleNavigation = (destination: string) => {
    trackEvent('404 Navigation', 'Click', destination);
  };

  const popularLinks = [
    { name: 'Home', href: '/', icon: Home, description: 'Return to homepage' },
    { name: 'Fights', href: '/fights', icon: Menu, description: 'View fight records' },
    { name: 'About Kumar', href: '/about', icon: Search, description: 'Learn about Kumar' },
    { name: 'Shop', href: '/shop', icon: Menu, description: 'Boxing merchandise' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-red-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Boxing Gloves 404 Animation */}
          <motion.div
            animate={{ 
              rotate: [-5, 5, -5],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-600">
              404
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-20"
            >
              <div className="w-full h-full rounded-full border-4 border-dashed border-yellow-400"></div>
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
              Page Not Found
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Looks like this page got knocked out! 🥊
            </p>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back in the ring with these options:
            </p>
          </div>

          {/* Navigation Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
          >
            {popularLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  onClick={() => handleNavigation(link.name)}
                  className="block p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-red-600/30 hover:border-red-500 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div 
                      className="p-3 rounded-full group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${designTokens.colors.primary.boxing_red}20` }}
                    >
                      <link.icon 
                        className="w-6 h-6" 
                        style={{ color: designTokens.colors.primary.championship_gold }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {link.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <button
              onClick={() => {
                handleNavigation('Browser Back');
                window.history.back();
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
            
            <Link
              to="/"
              onClick={() => handleNavigation('Home Button')}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: designTokens.colors.gradients.victory,
                color: designTokens.colors.primary.victory_white
              }}
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 text-sm">
              If you believe this is an error, please{' '}
              <a 
                href="mailto:info@kumarprescod.com" 
                className="text-yellow-400 hover:text-yellow-300 underline"
                onClick={() => handleNavigation('Contact Email')}
              >
                contact us
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;