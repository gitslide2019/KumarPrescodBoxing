import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Home, Smartphone } from 'lucide-react';
import { designTokens } from '../styles/design-tokens';

const Offline: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      // Automatically redirect when back online
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  const cachedContent = [
    { title: 'Fighter Profile', description: 'Kumar\'s bio and stats' },
    { title: 'Fight Records', description: 'Previous fight results' },
    { title: 'Training Photos', description: 'Behind-the-scenes content' },
    { title: 'News Articles', description: 'Latest boxing updates' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Connection Status Animation */}
          <motion.div
            animate={isOnline ? { scale: [1, 1.2, 1] } : { 
              rotate: [0, -10, 10, 0],
              scale: [1, 0.95, 1]
            }}
            transition={{ 
              duration: isOnline ? 0.6 : 2,
              repeat: isOnline ? 0 : Infinity,
              ease: "easeInOut"
            }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Pulse effect for online status */}
              {isOnline && (
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: designTokens.colors.semantic.success }}
                />
              )}
              
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
                style={{ 
                  backgroundColor: isOnline 
                    ? `${designTokens.colors.semantic.success}20` 
                    : `${designTokens.colors.semantic.error}20` 
                }}
              >
                {isOnline ? (
                  <Wifi 
                    className="w-12 h-12" 
                    style={{ color: designTokens.colors.semantic.success }}
                  />
                ) : (
                  <WifiOff 
                    className="w-12 h-12" 
                    style={{ color: designTokens.colors.semantic.error }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Status Message */}
          <div className="space-y-4">
            {isOnline ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <h1 className="text-4xl md:text-6xl font-bold font-display" style={{ color: designTokens.colors.semantic.success }}>
                  Back Online!
                </h1>
                <p className="text-xl text-gray-300">
                  Connection restored. Redirecting you back...
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                  You're Offline
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  No internet connection detected 📶
                </p>
                <p className="text-lg text-gray-400 max-w-xl mx-auto">
                  Check your network connection and try again. Some content may still be available offline.
                </p>
              </div>
            )}
          </div>

          {/* Offline Content Available */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center space-x-2">
                <Smartphone className="w-5 h-5" style={{ color: designTokens.colors.primary.championship_gold }} />
                <span>Available Offline</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cachedContent.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            {!isOnline && (
              <button
                onClick={handleRetry}
                disabled={isOnline}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  background: designTokens.colors.gradients.victory,
                  color: designTokens.colors.primary.victory_white
                }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
              </button>
            )}
            
            <Link
              to="/"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              <span>Cached Home</span>
            </Link>
          </motion.div>

          {/* Connection Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 space-y-4"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">Connection Tips:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="space-y-2">
                  <div style={{ color: designTokens.colors.primary.championship_gold, fontWeight: '500' }}>
                    Check WiFi
                  </div>
                  <div className="text-gray-400 text-sm">
                    Make sure you're connected to a working network
                  </div>
                </div>
                <div className="space-y-2">
                  <div style={{ color: designTokens.colors.primary.championship_gold, fontWeight: '500' }}>
                    Mobile Data
                  </div>
                  <div className="text-gray-400 text-sm">
                    Switch to mobile data if WiFi isn't working
                  </div>
                </div>
                <div className="space-y-2">
                  <div style={{ color: designTokens.colors.primary.championship_gold, fontWeight: '500' }}>
                    Restart Router
                  </div>
                  <div className="text-gray-400 text-sm">
                    Unplug your router for 30 seconds, then plug back in
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              The Kumar Prescod Boxing app works offline with cached content
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Offline;